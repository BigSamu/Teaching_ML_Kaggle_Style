# Generated by Django 3.1.7 on 2021-04-01 16:47

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('classroom', '0008_cohort_is_active'),
    ]

    operations = [
        migrations.AddField(
            model_name='participant',
            name='final_submission',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='participantf', to='classroom.submission'),
        ),
    ]
