# Generated by Django 3.1.7 on 2021-04-01 17:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ml_models', '0009_feature_comment'),
    ]

    operations = [
        migrations.AddField(
            model_name='competitionmodel',
            name='model_type',
            field=models.IntegerField(choices=[(1, 'Logistic Regression'), (2, 'Decision Tree')], default=1),
            preserve_default=False,
        ),
    ]
