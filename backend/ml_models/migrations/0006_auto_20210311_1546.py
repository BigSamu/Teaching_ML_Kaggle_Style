# Generated by Django 3.1.7 on 2021-03-11 15:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ml_models', '0005_merge_20210306_2212'),
    ]

    operations = [
        migrations.AlterField(
            model_name='competitionmodel',
            name='status_cd',
            field=models.IntegerField(choices=[(1, 'Untrained'), (2, 'Success'), (3, 'Failure')]),
        ),
    ]