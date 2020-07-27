from tests.models import ListTests

allTest = ListTests.objects.all()
for line in open('listTests.txt'):
    print(line)

print(allTest)
