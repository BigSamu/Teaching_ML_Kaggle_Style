# Generated by Django 3.1.7 on 2021-04-20 23:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ml_models', '0018_auto_20210420_2324'),
    ]

    operations = [
        migrations.AlterField(
            model_name='competitionmodel',
            name='features',
            field=models.TextField(),
        ),
        migrations.AlterField(
            model_name='competitionmodel',
            name='serialization',
            field=models.TextField(),
        ),
    ]
