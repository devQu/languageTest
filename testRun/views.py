# -*- coding: utf-8 -*- 

from django.shortcuts import render
from django.template import RequestContext
from django.views.generic import View, DetailView, ListView
from userApp.models import ListUsers
from tests.models import ListTests, TestMassif
from django.core import serializers
#from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin
import json, collections, random
from django.http import JsonResponse, Http404, HttpResponse

class TestRun(LoginRequiredMixin, DetailView):

    login_url = '/account/login'
    model = ListTests
    template_name = 'runtest.html'

def testProcessing(request, slug):

    currentTest = ListTests.objects.get(slug=slug)
    listTestMassif = currentTest.test_items.all().order_by('id')

    ### By default
    statusFinal = False
    pos = 0
    stat = "set_form"

    ### Get status of output data from input_hidden 
    ### Set stat for backend
    if request.GET.get('status') == "form_insert":
        stat = "set_result"
    elif request.GET.get('status') == "result_insert":
        stat = "set_form"
    elif request.GET.get('status') == "theory_done":
        stat = "set_form"
    elif request.GET.get('status') == "restart":
        stat = "test_restart"

    print(slug)

    ### Set position of test iterate
    if ListUsers.objects.filter(user=request.user).exists():
        current_user = ListUsers.objects.get(user = request.user)
        try:
            testAccomplishCurrent = current_user.tests_accomplishment_json[currentTest.title]
        except KeyError as error:
            testAccomplishCurrent = {}
        ### Check if need to set result 
        if stat == "set_result":
            pos = len(testAccomplishCurrent)
        ### Restart current test
        elif stat == "test_restart":
            ListUsers.objects.filter(user=request.user).delete()
            ### Parse theory after restart
            stat = "set_theory"
            testAccomplishCurrent = {}
        ### Check if need to set form
        elif stat == "set_form":
            if currentTest.quantity > len(testAccomplishCurrent):
                pos = len(testAccomplishCurrent)
                ### If theory item --> set stat to "set_theory"
                if listTestMassif[len(testAccomplishCurrent)].type_question.title == "theory":
                    stat = "set_theory"
            else:
                ### All items are over
                statusFinal = True
    else:
        ### Start forever with stat "set_theory"
        stat = "set_theory"
        pos = 0
        testAccomplishCurrent = {}

    ### Get context, success_level, countSuccess
    context, success_level, countSuccess = get_context(request, stat, statusFinal, currentTest, pos, listTestMassif, testAccomplishCurrent)

    ### Save result for User
    if ListUsers.objects.filter(user=request.user).exists():
        current_user = ListUsers.objects.get(user = request.user)
        if stat == "set_result" or stat == "set_theory":
            current_user.tests_accomplishment_json[currentTest.title].update({str(len(testAccomplishCurrent)): success_level})
            current_user.save()
        ### Save final result in <tests_success_json>
        if statusFinal:
            current_user.tests_success_json = {currentTest.title: countSuccess}
            current_user.save(update_fields=['tests_success_json'])
    else:
        if stat == "set_result" or stat == "set_theory":
            progress = {currentTest.title: {str(0): success_level}}
            current_user = ListUsers(user = request.user, tests_accomplishment_json = progress)
            current_user.save()

    #############################################
    if request.is_ajax():
        data = json.dumps(context)
        #data = serializers.serialize('json', listTestMassif[0])

        return HttpResponse(data)
    else:
        return render(request, 'runtest.html', {'testItem': listTestMassif})
    #############################################

def get_context(request, stat, statusFinal, currentTest, pos, listMas, testAccomplishCurrent):
    ### Fill context variables
    itemPos = listMas[pos]
    quantity = currentTest.quantity
    question = itemPos.question
    style_type = itemPos.style_type
    examples_list = itemPos.examples_json
    type_question = itemPos.type_question.title
    order_list = itemPos.order_list
    theory_obj = itemPos.theory_json
    success_level = True # Default if level is end
    countSuccess = 0
    try:
        accomplish_list = list(collections.OrderedDict(sorted(testAccomplishCurrent.items())).values())
    except UnboundLocalError as error:
        accomplish_list = [] # List of levels passed
    list_type = list(map(lambda x: x.type_question.title, listMas)) # Types of all test items
    theory_list = [] # Only theory items
    theory_dict = {}
    for i, item in enumerate(listMas):
        if listMas[i].type_question.title == "theory":
            theory_list.append([i, item.theory_json.get("0").get("_header")])
            theory_dict.update({i: list(collections.OrderedDict(sorted(listMas[i].theory_json.items())).values())})

    #theory_sorted = list(collections.OrderedDict(sorted(theory_obj.items())).values())
    #for it in theory_sorted:
    #    theory_dict.append(it)

    if not statusFinal: 
        mas_temp = [] # For full answers_user
        texts = []
        answers = []
        insert_list = []
        choise_list = []
        order_user = [] # Answers of User for order
        order_random_list = [] # Shuffle order_list
        answers_user = [] # Answers of User for insert, choise
        count_errors = 0 # Number of level errors

        ### Fill context variables for insert and choise
        ### GET values from ajax
        if type_question == "insert" or type_question == "choise":

            for i in range(0, len(itemPos.text_answers_json)):
                texts.append(itemPos.text_answers_json[str(i)]['text'].split("/"))
                answers.append(itemPos.text_answers_json[str(i)]['answers'])
                if type_question == "insert":
                    insert_list.append(itemPos.insert_json[str(i)])
                elif type_question == "choise":
                    choise_list.append(itemPos.choise_json[str(i)])
            
            for i, answer in enumerate(answers):
                for j, item in enumerate(answer):
                    mas_temp.append(request.GET.get('str'+ str(i) +'num' + str(j)))
                    if request.GET.get('str'+ str(i) +'num' + str(j)) != answers[i][j]:
                        success_level = False
                        count_errors += 1
                answers_user.append(mas_temp)
                mas_temp = []

        ### Fill context variables for order
        ### GET values from ajax
        elif type_question == "order":

            for i in range(0, len(order_list)):
                print(request.GET.get('num' + str(i)))
                order_user.append(request.GET.get('num' + str(i)))
                if order_list[i] != request.GET.get('num' + str(i)):
                    success_level = False
                    count_errors += 1

            order_random_list = random.sample(order_list, len(order_list))

        ### Fill context variables for theory
        elif type_question == "theory":
            
            stat = "set_theory"
            

        ### Set actual context
        context = {
            'quantity': quantity,
            'stat': stat,
            'position': pos + 1,
            'accomplish_list': accomplish_list,
            'list_type': list_type,
            'theory_list': theory_list,
            'statusFinal': statusFinal,
            'theory_dict': theory_dict
        }
        if stat == "set_form" or stat == "set_result": context.update({
            'question': question, 
            'type_question': type_question,
            'examples': examples_list,
            'texts': texts,
            'style_type': style_type
        })
        if stat == "set_form" and type_question == "choise": context.update({ 
            'choise_list': choise_list,
            'answers': answers
        })
        elif (stat == "set_form" or stat == "set_result") and type_question == "order": context.update({ 
            'order_random_list': order_random_list
        })
        elif (stat == "set_form" or stat == "set_result") and type_question == "insert": context.update({ 
            'insert_list': insert_list
        })
        if stat == "set_result": context.update({
            'answers': answers, 
            'count_errors': count_errors 
        })
        if stat == "set_result" and type_question == "insert": context.update({ 
            'answers_user': answers_user
        })
        elif stat == "set_result" and type_question == "choise": context.update({ 
            'answers_user': answers_user
        })
        elif stat == "set_result" and type_question == "order": context.update({ 
            'order_user': order_user,
            'order_list': order_list
        })

    ### If test is over
    else:
        resultString = ""
        for i in testAccomplishCurrent.values():
            if i == True: countSuccess += 1
        quantity = currentTest.quantity
        if countSuccess == quantity:
            resultString = "Блестящий результат!"
        elif countSuccess == 0:
            resultString = "Вам стоит как следует позаниматься..:("
        else:
            if countSuccess <= quantity * 0.3:
                resultString = "Вам предстоит ещё много работы! :("
            elif countSuccess <= quantity * 0.5:
                resultString = "Ваш результат оставляет желать лучшего, но не опускайте руки!"
            elif countSuccess <= quantity * 0.8:
                resultString = "Неплохо, но далеко не безупречно. Вам стоит ещё повторить эту тему!"
            else:
                resultString = "Отличный результат! Вы замечательно усвоили данную тему :)"

        context = {
            'statusFinal': statusFinal,
            'countSuccess': countSuccess,
            'quantity': quantity,
            'resultString': resultString
        }
    return context, success_level, countSuccess