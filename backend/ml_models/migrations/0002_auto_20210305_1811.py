# Generated by Django 3.1.6 on 2021-03-05 18:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ml_models', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='dectreenode',
            name='side',
            field=models.IntegerField(choices=[(0, 'root'), (1, 'left'), (2, 'right'), (3, 'unclassified')]),
        ),
    ]
