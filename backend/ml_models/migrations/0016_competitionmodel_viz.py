# Generated by Django 3.1.7 on 2021-04-18 04:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ml_models', '0015_auto_20210416_2244'),
    ]

    operations = [
        migrations.AddField(
            model_name='competitionmodel',
            name='viz',
            field=models.CharField(max_length=2048, null=True),
        ),
    ]
