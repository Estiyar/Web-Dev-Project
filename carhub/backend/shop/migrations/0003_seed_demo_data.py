from django.db import migrations
from django.contrib.auth.hashers import make_password


def seed_demo_data(apps, schema_editor):
    User = apps.get_model('auth', 'User')
    Category = apps.get_model('shop', 'Category')
    Car = apps.get_model('shop', 'Car')
    Part = apps.get_model('shop', 'Part')
    CommunityPost = apps.get_model('shop', 'CommunityPost')
    CommunityComment = apps.get_model('shop', 'CommunityComment')
    Review = apps.get_model('shop', 'Review')

    if Car.objects.exists():
        return

    demo_user, _ = User.objects.get_or_create(
        username='demo_user',
        defaults={'email': 'demo@carhub.kz', 'password': make_password('demo12345')},
    )
    demo_user.password = make_password('demo12345')
    demo_user.save(update_fields=['password'])

    seller_user, _ = User.objects.get_or_create(
        username='seller_kz',
        defaults={'email': 'seller@carhub.kz', 'password': make_password('demo12345')},
    )
    seller_user.password = make_password('demo12345')
    seller_user.save(update_fields=['password'])

    categories = {}
    for name in ['Toyota', 'BMW', 'Mercedes', 'Hyundai', 'Kia', 'Lexus', 'Chevrolet', 'Nissan']:
        categories[name], _ = Category.objects.get_or_create(name=name, defaults={'icon': '🚗'})

    cars = [
        {
            'owner': demo_user, 'category': categories['Toyota'], 'title': 'Toyota Camry 2020, 2.5 AT',
            'brand': 'Toyota', 'model': 'Camry', 'year': 2020, 'price': 12900000, 'mileage': 68000,
            'body_type': 'Sedan', 'engine_volume': 2.5, 'fuel_type': 'Petrol', 'transmission': 'Automatic',
            'drivetrain': 'FWD', 'color': 'White', 'condition': 'used', 'city': 'Алматы',
            'image_url': 'https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=1200&q=80',
            'description': 'Один владелец, обслуживалась по регламенту, без вложений.'
        },
        {
            'owner': seller_user, 'category': categories['BMW'], 'title': 'BMW X5 2019, xDrive40i',
            'brand': 'BMW', 'model': 'X5', 'year': 2019, 'price': 25800000, 'mileage': 91000,
            'body_type': 'SUV', 'engine_volume': 3.0, 'fuel_type': 'Petrol', 'transmission': 'Automatic',
            'drivetrain': 'AWD', 'color': 'Black', 'condition': 'used', 'city': 'Астана',
            'image_url': 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80',
            'description': 'Хорошая комплектация, панорама, камеры 360.'
        },
        {
            'owner': demo_user, 'category': categories['Mercedes'], 'title': 'Mercedes-Benz E200 2021',
            'brand': 'Mercedes', 'model': 'E200', 'year': 2021, 'price': 23800000, 'mileage': 42000,
            'body_type': 'Sedan', 'engine_volume': 2.0, 'fuel_type': 'Petrol', 'transmission': 'Automatic',
            'drivetrain': 'RWD', 'color': 'Silver', 'condition': 'used', 'city': 'Шымкент',
            'image_url': 'https://images.unsplash.com/photo-1617469767053-d3b523a0b982?auto=format&fit=crop&w=1200&q=80',
            'description': 'Чистый салон, дилерское обслуживание, отличное состояние.'
        },
        {
            'owner': seller_user, 'category': categories['Hyundai'], 'title': 'Hyundai Tucson 2022',
            'brand': 'Hyundai', 'model': 'Tucson', 'year': 2022, 'price': 15400000, 'mileage': 27000,
            'body_type': 'SUV', 'engine_volume': 2.0, 'fuel_type': 'Petrol', 'transmission': 'Automatic',
            'drivetrain': 'FWD', 'color': 'Gray', 'condition': 'used', 'city': 'Алматы',
            'image_url': 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1200&q=80',
            'description': 'Машина в заводском окрасе, свежая резина, два ключа.'
        },
        {
            'owner': demo_user, 'category': categories['Kia'], 'title': 'Kia K5 2021',
            'brand': 'Kia', 'model': 'K5', 'year': 2021, 'price': 13200000, 'mileage': 51000,
            'body_type': 'Sedan', 'engine_volume': 2.5, 'fuel_type': 'Petrol', 'transmission': 'Automatic',
            'drivetrain': 'FWD', 'color': 'Blue', 'condition': 'used', 'city': 'Астана',
            'image_url': 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
            'description': 'Комфортный бизнес-седан, все расходники заменены.'
        },
        {
            'owner': seller_user, 'category': categories['Lexus'], 'title': 'Lexus RX 350 2018',
            'brand': 'Lexus', 'model': 'RX 350', 'year': 2018, 'price': 22500000, 'mileage': 103000,
            'body_type': 'SUV', 'engine_volume': 3.5, 'fuel_type': 'Petrol', 'transmission': 'Automatic',
            'drivetrain': 'AWD', 'color': 'White', 'condition': 'used', 'city': 'Алматы',
            'image_url': 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1200&q=80',
            'description': 'Надежный кроссовер, комфортная подвеска, без ДТП.'
        },
    ]

    created_cars = [Car.objects.create(**car) for car in cars]

    parts = [
        {
            'owner': demo_user, 'title': 'Фара левая Toyota Camry 70', 'brand': 'Toyota', 'model': 'Camry',
            'part_category': 'Оптика', 'condition': 'used', 'price': 180000, 'city': 'Алматы',
            'description': 'Оригинальная LED-фара, крепления целые.',
            'image_url': 'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&w=1200&q=80',
        },
        {
            'owner': seller_user, 'title': 'Диск BMW X5 R20', 'brand': 'BMW', 'model': 'X5',
            'part_category': 'Диски', 'condition': 'used', 'price': 145000, 'city': 'Астана',
            'description': 'Один диск, без сварки и трещин.',
            'image_url': 'https://images.unsplash.com/photo-1616789916664-f5b4db2d0b0f?auto=format&fit=crop&w=1200&q=80',
        },
        {
            'owner': demo_user, 'title': 'Передний бампер Mercedes E-Class', 'brand': 'Mercedes', 'model': 'E200',
            'part_category': 'Кузов', 'condition': 'used', 'price': 220000, 'city': 'Шымкент',
            'description': 'Под парктроники, в хорошем состоянии.',
            'image_url': 'https://images.unsplash.com/photo-1502161254066-6c74afbf07aa?auto=format&fit=crop&w=1200&q=80',
        },
        {
            'owner': seller_user, 'title': 'Коробка Hyundai Tucson 2.0 AT', 'brand': 'Hyundai', 'model': 'Tucson',
            'part_category': 'Трансмиссия', 'condition': 'used', 'price': 430000, 'city': 'Алматы',
            'description': 'АКПП с гарантией на установку и проверку.',
            'image_url': 'https://images.unsplash.com/photo-1517524206127-48bbd363f3d7?auto=format&fit=crop&w=1200&q=80',
        },
        {
            'owner': demo_user, 'title': 'Радиатор Kia K5', 'brand': 'Kia', 'model': 'K5',
            'part_category': 'Охлаждение', 'condition': 'new', 'price': 95000, 'city': 'Астана',
            'description': 'Новый аналог хорошего качества.',
            'image_url': 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80',
        },
        {
            'owner': seller_user, 'title': 'Зеркало Lexus RX 350', 'brand': 'Lexus', 'model': 'RX 350',
            'part_category': 'Кузов', 'condition': 'used', 'price': 120000, 'city': 'Алматы',
            'description': 'Левое зеркало с подогревом и автоскладыванием.',
            'image_url': 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80',
        },
    ]
    for part in parts:
        Part.objects.create(**part)

    posts = [
        {'author': demo_user, 'title': 'Camry 70: какой мотор лучше для города?', 'description': 'Выбираю между 2.0 и 2.5. Нужен реальный опыт владельцев по расходу и обслуживанию.', 'brand': 'Toyota'},
        {'author': seller_user, 'title': 'BMW X5 с пробегом 100 тыс: на что смотреть?', 'description': 'Интересует список типовых проблем и на что обратить внимание при подборе.', 'brand': 'BMW'},
        {'author': demo_user, 'title': 'Mercedes E200: дорогая ли эксплуатация?', 'description': 'Кто ездит ежедневно по городу, подскажите по расходам и сервису.', 'brand': 'Mercedes'},
        {'author': seller_user, 'title': 'Hyundai Tucson или Kia Sportage?', 'description': 'Что практичнее для семьи и поездок между городами?', 'brand': 'Hyundai'},
        {'author': demo_user, 'title': 'Lexus RX 350 после 100 тыс км', 'description': 'Интересует надежность подвески и стоимость оригинальных запчастей.', 'brand': 'Lexus'},
    ]
    created_posts = [CommunityPost.objects.create(**post) for post in posts]

    comments = [
        {'post': created_posts[0], 'author': seller_user, 'text': 'Для города 2.5 заметно приятнее, по расходу разница небольшая.'},
        {'post': created_posts[1], 'author': demo_user, 'text': 'Обязательно смотреть пневму, историю обслуживания и течи по мотору.'},
        {'post': created_posts[2], 'author': seller_user, 'text': 'Если брать живой экземпляр, по комфорту машина отличная.'},
        {'post': created_posts[3], 'author': demo_user, 'text': 'Tucson чуть мягче, Sportage интереснее по дизайну.'},
        {'post': created_posts[4], 'author': seller_user, 'text': 'RX обычно надежный, но живые машины стоят дороже рынка.'},
    ]
    for comment in comments:
        CommunityComment.objects.create(**comment)

    Review.objects.create(car=created_cars[0], user=seller_user, rating=5, text='Аккуратный автомобиль, владелец всё подробно рассказал.')
    Review.objects.create(car=created_cars[1], user=demo_user, rating=4, text='Хорошая машина, но проверяйте историю обслуживания.')


def unseed_demo_data(apps, schema_editor):
    User = apps.get_model('auth', 'User')
    User.objects.filter(username__in=['demo_user', 'seller_kz']).delete()


class Migration(migrations.Migration):
    dependencies = [
        ('shop', '0002_part_and_car_fields'),
    ]

    operations = [
        migrations.RunPython(seed_demo_data, unseed_demo_data),
    ]
