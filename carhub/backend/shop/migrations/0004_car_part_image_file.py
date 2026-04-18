from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('shop', '0003_seed_demo_data'),
    ]

    operations = [
        migrations.AddField(
            model_name='car',
            name='image_file',
            field=models.FileField(blank=True, null=True, upload_to='cars/'),
        ),
        migrations.AddField(
            model_name='part',
            name='image_file',
            field=models.FileField(blank=True, null=True, upload_to='parts/'),
        ),
    ]
