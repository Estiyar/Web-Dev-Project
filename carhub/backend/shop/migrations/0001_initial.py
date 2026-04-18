from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Category',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('icon', models.CharField(default='🚗', max_length=100)),
            ],
            options={
                'verbose_name_plural': 'Categories',
            },
        ),
        migrations.CreateModel(
            name='Car',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=200)),
                ('brand', models.CharField(max_length=100)),
                ('model', models.CharField(max_length=100)),
                ('year', models.IntegerField()),
                ('price', models.DecimalField(decimal_places=2, max_digits=12)),
                ('mileage', models.IntegerField(default=0)),
                ('condition', models.CharField(choices=[('new', 'Новый'), ('used', 'Б/У')], default='used', max_length=10)),
                ('description', models.TextField()),
                ('city', models.CharField(default='Алматы', max_length=100)),
                ('image_url', models.URLField(blank=True, default='')),
                ('is_active', models.BooleanField(default=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('category', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='cars', to='shop.category')),
                ('owner', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='cars', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ['-created_at'],
            },
        ),
        migrations.CreateModel(
            name='CommunityPost',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=200)),
                ('description', models.TextField()),
                ('brand', models.CharField(max_length=100)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('author', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='community_posts', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ['-created_at'],
            },
        ),
        migrations.CreateModel(
            name='Review',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('rating', models.IntegerField(default=5)),
                ('text', models.TextField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('car', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='reviews', to='shop.car')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='reviews', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Favorite',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('car', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='favorited_by', to='shop.car')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='favorites', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'unique_together': {('user', 'car')},
            },
        ),
        migrations.CreateModel(
            name='CommunityComment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('text', models.TextField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('author', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='community_comments', to=settings.AUTH_USER_MODEL)),
                ('post', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='comments', to='shop.communitypost')),
            ],
            options={
                'ordering': ['-created_at'],
            },
        ),
    ]
