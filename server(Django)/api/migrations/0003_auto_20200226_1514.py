# Generated by Django 2.2.5 on 2020-02-26 07:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_auto_20200226_1451'),
    ]

    operations = [
        migrations.AlterField(
            model_name='treehole',
            name='pic',
            field=models.CharField(blank=True, max_length=255, null=True, verbose_name='图片'),
        ),
    ]