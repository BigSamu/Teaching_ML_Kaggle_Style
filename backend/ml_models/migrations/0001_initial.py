# Generated by Django 3.1.7 on 2021-02-27 16:36

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='CompetitionModel',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('status_cd', models.IntegerField(choices=[(1, 'Training'), (2, 'Success'), (3, 'Failure')])),
                ('competition_no', models.IntegerField(choices=[(1, 'Competition 1'), (2, 'Competition 2')])),
            ],
        ),
        migrations.CreateModel(
            name='Feature',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=64)),
            ],
        ),
        migrations.CreateModel(
            name='Scoring',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('data_type', models.IntegerField(choices=[(1, 'train'), (2, 'test'), (3, 'validation')])),
                ('true_positive_rate', models.FloatField()),
                ('false_positive_rate', models.FloatField()),
                ('true_negative_rate', models.FloatField()),
                ('false_negative_rate', models.FloatField()),
                ('competition_model', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='ml_models.competitionmodel')),
            ],
        ),
        migrations.CreateModel(
            name='LogRegElement',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('weight', models.FloatField()),
                ('completeness', models.BooleanField()),
                ('competition_model', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='ml_models.competitionmodel')),
                ('feature', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='ml_models.feature')),
            ],
        ),
        migrations.CreateModel(
            name='DecTreeNode',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('side', models.IntegerField(choices=[(0, 'root'), (1, 'left'), (2, 'right'), (-1, 'Untraied')])),
                ('classification', models.CharField(max_length=64)),
                ('threshold', models.FloatField()),
                ('completeness', models.BooleanField()),
                ('competition_model', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='ml_models.competitionmodel')),
                ('feature', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='ml_models.feature')),
                ('parent_node', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='ml_models.dectreenode')),
            ],
        ),
    ]