# Generated by Django 3.1.7 on 2021-04-06 22:12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ml_models', '0012_auto_20210403_0827'),
    ]

    operations = [
        migrations.AddField(
            model_name='feature',
            name='data_source',
            field=models.CharField(default='CommunityViolations', max_length=64),
            preserve_default=False,
        ),
    ]