import json
from django.contrib.postgres.forms.jsonb import InvalidJSONInput, JSONField

class ReadableJSONFormField(JSONField):
    def prepare_value(self, value):
        if isinstance(value, InvalidJSONInput):
            return value
        return json.dumps(value, ensure_ascii=False, indent=4)