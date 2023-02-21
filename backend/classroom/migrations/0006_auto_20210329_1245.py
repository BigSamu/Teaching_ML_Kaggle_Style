# Generated by Django 3.1.7 on 2021-03-29 12:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('classroom', '0005_auto_20210314_0034'),
    ]

    operations = [
        migrations.RenameField(
            model_name='cohort',
            old_name='is_active',
            new_name='competition_1_access',
        ),
        migrations.AddField(
            model_name='cohort',
            name='competition_2_access',
            field=models.BooleanField(default=False),
            preserve_default=False,
        ),
    ]