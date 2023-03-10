# Generated by Django 3.1.7 on 2021-04-02 12:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ml_models', '0010_competitionmodel_model_type'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='logregelement',
            name='competition_model',
        ),
        migrations.RemoveField(
            model_name='logregelement',
            name='feature',
        ),
        migrations.AddField(
            model_name='competitionmodel',
            name='features',
            field=models.CharField(default='', max_length=256),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='competitionmodel',
            name='serialization',
            field=models.CharField(default='', max_length=1024),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='competitionmodel',
            name='model_type',
            field=models.IntegerField(choices=[(1, 'Logistic Regression'), (2, 'Decision Tree')], default=1),
        ),
        migrations.DeleteModel(
            name='DecTreeNode',
        ),
        migrations.DeleteModel(
            name='LogRegElement',
        ),
    ]
