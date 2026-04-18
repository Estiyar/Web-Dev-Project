from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ('shop', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='car',
            name='body_type',
            field=models.CharField(default='Sedan', max_length=50),
        ),
        migrations.AddField(
            model_name='car',
            name='color',
            field=models.CharField(default='Black', max_length=50),
        ),
        migrations.AddField(
            model_name='car',
            name='drivetrain',
            field=models.CharField(default='FWD', max_length=50),
        ),
        migrations.AddField(
            model_name='car',
            name='engine_volume',
            field=models.DecimalField(decimal_places=1, default=2.0, max_digits=3),
        ),
        migrations.AddField(
            model_name='car',
            name='fuel_type',
            field=models.CharField(default='Petrol', max_length=50),
        ),
        migrations.AddField(
            model_name='car',
            name='transmission',
            field=models.CharField(default='Automatic', max_length=50),
        ),
        migrations.CreateModel(
            name='Part',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=200)),
                ('brand', models.CharField(max_length=100)),
                ('model', models.CharField(max_length=100)),
                ('part_category', models.CharField(max_length=100)),
                ('condition', models.CharField(choices=[('new', 'Новая'), ('used', 'Б/У')], default='used', max_length=10)),
                ('price', models.DecimalField(decimal_places=2, max_digits=12)),
                ('city', models.CharField(default='Алматы', max_length=100)),
                ('description', models.TextField()),
                ('image_url', models.URLField(blank=True, default='')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('owner', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='parts', to='auth.user')),
            ],
            options={
                'ordering': ['-created_at'],
            },
        ),
    ]
