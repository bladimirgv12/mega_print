<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Category;
use App\Models\Product;
use App\Models\Job;
use App\Models\Testimonial;
use App\Models\AboutSection;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // ── Admin User ──
        User::firstOrCreate(
            ['email' => 'admin@megaprint.bo'],
            [
                'name'     => 'Administrador MegaPrint',
                'email'    => 'admin@megaprint.bo',
                'password' => Hash::make('password'),
            ]
        );

        // ── Categories ──
        $categories = [
            ['name' => 'Impresión Digital',    'slug' => 'impresion-digital',    'icon' => '🖨️', 'order' => 1],
            ['name' => 'Señalética',            'slug' => 'senaletica',           'icon' => '🪧', 'order' => 2],
            ['name' => 'Textil',                'slug' => 'textil',               'icon' => '👕', 'order' => 3],
            ['name' => 'Rótulos y Letreros',    'slug' => 'rotulos-letreros',     'icon' => '✨', 'order' => 4],
            ['name' => 'Corte y Grabado Láser', 'slug' => 'corte-grabado-laser', 'icon' => '⚡', 'order' => 5],
            ['name' => 'Promocionales',         'slug' => 'promocionales',        'icon' => '🎁', 'order' => 6],
        ];

        foreach ($categories as $cat) {
            Category::firstOrCreate(['slug' => $cat['slug']], array_merge($cat, ['is_active' => true]));
        }

        $cat1 = Category::where('slug', 'impresion-digital')->first();
        $cat2 = Category::where('slug', 'rotulos-letreros')->first();
        $cat3 = Category::where('slug', 'corte-grabado-laser')->first();
        $cat4 = Category::where('slug', 'promocionales')->first();

        // ── Products ──
        $products = [
            [
                'category_id' => $cat1->id,
                'name'        => 'Manta Vinílica',
                'description' => 'Mantas vinílicas de alta resolución para publicidad exterior e interior. Resistentes a la intemperie con colores vibrantes y duraderos.',
                'materials'   => 'Vinilo lona 440g, tinta UV resistente',
                'features'    => "Alta resolución 1440dpi\nResistente a UV y lluvia\nDisponible en cualquier medida\nEnvío a domicilio",
                'price'       => 80.00,
                'price_unit'  => 'm²',
                'is_featured' => true,
                'order'       => 1,
            ],
            [
                'category_id' => $cat1->id,
                'name'        => 'Stickers Adhesivos',
                'description' => 'Stickers y etiquetas adhesivas personalizadas en cualquier forma y tamaño. Ideales para branding, packaging y decoración.',
                'materials'   => 'Vinilo adhesivo, laminado brillante o mate',
                'features'    => "Corte a cualquier forma\nLaminado UV disponible\nInterior y exterior\nDesde 50 unidades",
                'price'       => 5.00,
                'price_unit'  => 'unidad',
                'is_featured' => true,
                'order'       => 2,
            ],
            [
                'category_id' => $cat2->id,
                'name'        => 'Rótulo 3D',
                'description' => 'Letras y logotipos en relieve 3D en acrílico, PVC o foam. Efecto premium para tu negocio o empresa.',
                'materials'   => 'Acrílico 5mm, PVC espumado, foam 3D',
                'features'    => "Efecto tridimensional\nBacklight disponible\nColores personalizados\nInstalación incluida",
                'price'       => 350.00,
                'price_unit'  => 'unidad',
                'is_featured' => true,
                'order'       => 3,
            ],
            [
                'category_id' => $cat2->id,
                'name'        => 'Letras 3D Iluminadas',
                'description' => 'Letras corporativas con iluminación LED. El branding de alto impacto que tu empresa merece.',
                'materials'   => 'Acrílico, LED 12V, estructura de aluminio',
                'features'    => "Iluminación LED incluida\nAhorro de energía\nVisibilidad nocturna\nGarantía 1 año",
                'price'       => 800.00,
                'price_unit'  => 'letra',
                'is_featured' => true,
                'order'       => 4,
            ],
            [
                'category_id' => $cat3->id,
                'name'        => 'Grabado Láser',
                'description' => 'Grabado láser de precisión en madera, acrílico, cuero, metal y más. Personalización perfecta para regalos corporativos.',
                'materials'   => 'Madera, acrílico, cuero, metal, vidrio',
                'features'    => "Precisión milimétrica\nMúltiples materiales\nIdeal para regalos\nEnvío a todo Bolivia",
                'price'       => 50.00,
                'price_unit'  => 'pieza',
                'is_featured' => true,
                'order'       => 5,
            ],
            [
                'category_id' => $cat4->id,
                'name'        => 'Llaveros Personalizados',
                'description' => 'Llaveros en acrílico, madera o metal con diseño personalizado. Perfectos para promociones y eventos corporativos.',
                'materials'   => 'Acrílico, madera, metal',
                'features'    => "Desde 50 unidades\nDiseño incluido\nMúltiples materiales\nEntrega en 48h",
                'price'       => 12.00,
                'price_unit'  => 'unidad',
                'is_featured' => false,
                'order'       => 6,
            ],
            [
                'category_id' => $cat4->id,
                'name'        => 'Sellos Automáticos',
                'description' => 'Sellos automáticos Trodat y Colop de alta calidad. Ideales para empresas, profesionales e instituciones.',
                'materials'   => 'Cuerpo automático importado, tinta premium',
                'features'    => "Hasta 50.000 impresiones\nTinta incluida\nRecarga disponible\nDiseño personalizado",
                'price'       => 120.00,
                'price_unit'  => 'unidad',
                'is_featured' => false,
                'order'       => 7,
            ],
            [
                'category_id' => $cat1->id,
                'name'        => 'Carteles PVC',
                'description' => 'Carteles rígidos en PVC de 3mm o 5mm. Ideales para señalización, inmobiliarias, construcción y publicidad exterior.',
                'materials'   => 'PVC 3mm o 5mm, impresión UV directa',
                'features'    => "Rigidez total\nResistente agua y UV\nInstalación sencilla\nFormatos estándar y personalizados",
                'price'       => 150.00,
                'price_unit'  => 'm²',
                'is_featured' => false,
                'order'       => 8,
            ],
        ];

        foreach ($products as $prod) {
            $slug = \Illuminate\Support\Str::slug($prod['name']);
            Product::firstOrCreate(['slug' => $slug], array_merge($prod, ['slug' => $slug, 'is_active' => true]));
        }

        // ── Jobs ──
        $jobs = [
            ['title' => 'Rotulación Camión Empresa TechCorp', 'category_id' => $cat2->id, 'location' => 'Santa Cruz', 'description' => 'Rotulación completa de flota vehicular con identidad corporativa.', 'date' => '2024-03-15'],
            ['title' => 'Manta Evento Fashion Week Bolivia', 'category_id' => $cat1->id, 'location' => 'Santa Cruz', 'description' => 'Impresión de mantas gigantes para evento de moda.', 'date' => '2024-02-20'],
            ['title' => 'Letras 3D Restaurante El Buen Sabor', 'category_id' => $cat2->id, 'location' => 'Cochabamba', 'description' => 'Letras en relieve con iluminación LED para fachada de restaurante.', 'date' => '2024-01-10'],
            ['title' => 'Grabado Láser Regalos Corporativos', 'category_id' => $cat3->id, 'location' => 'Santa Cruz', 'description' => '500 regalos corporativos personalizados con grabado láser.', 'date' => '2024-04-05'],
        ];

        foreach ($jobs as $job) {
            $slug = \Illuminate\Support\Str::slug($job['title']) . '-' . rand(1000, 9999);
            Job::firstOrCreate(['slug' => $slug], array_merge($job, ['slug' => $slug, 'is_active' => true]));
        }

        // ── Testimonials ──
        $testimonials = [
            ['name' => 'Carlos Mendoza', 'comment' => 'Excelente servicio! Las mantas vinílicas quedaron perfectas para mi local. La calidad superó mis expectativas y el tiempo de entrega fue rapidísimo.', 'rating' => 5, 'product' => 'Manta Vinílica', 'is_approved' => true],
            ['name' => 'María López', 'comment' => 'Los rótulos 3D de mi empresa quedaron increíbles. Muy profesionales y el diseño fue exactamente lo que pedí. 100% recomendados.', 'rating' => 5, 'product' => 'Rótulo 3D', 'is_approved' => true],
            ['name' => 'Jorge Quispe', 'comment' => 'Los stickers para mi emprendimiento quedaron perfectos. Colores vivos y el material es muy resistente. Definitivamente volvería a comprar.', 'rating' => 5, 'product' => 'Stickers', 'is_approved' => true],
            ['name' => 'Ana Torrico', 'comment' => 'Mandé hacer grabados láser para regalos de fin de año y todos quedaron impresionados. El detalle y la precisión son increíbles.', 'rating' => 5, 'product' => 'Grabado Láser', 'is_approved' => true],
            ['name' => 'Roberto Flores', 'comment' => 'Muy buen trabajo en el rotulado de mi flota de vehículos. Precio justo, excelente calidad y entrega a tiempo. Muy satisfecho.', 'rating' => 5, 'product' => 'Rotulación vehicular', 'is_approved' => true],
        ];

        foreach ($testimonials as $t) {
            Testimonial::firstOrCreate(['name' => $t['name'], 'comment' => $t['comment']], $t);
        }

        // ── About Sections ──
        $abouts = [
            ['title' => 'Nuestra Historia', 'type' => 'historia', 'content' => 'MegaPrint nació en 2013 con una visión clara: democratizar la impresión profesional en Bolivia. Comenzamos con una pequeña máquina de impresión y un gran sueño. Hoy, más de 10 años después, contamos con equipos de última generación y hemos completado más de 500 proyectos para clientes de todo el país.', 'order' => 1],
            ['title' => 'Nuestra Misión', 'type' => 'mision', 'content' => 'Proveer soluciones de impresión y publicidad de calidad excepcional, ayudando a nuestros clientes a comunicar su marca de manera impactante, memorable y profesional. Nos comprometemos a superar las expectativas en cada proyecto.', 'order' => 2],
            ['title' => 'Nuestra Visión', 'type' => 'vision', 'content' => 'Ser la empresa líder en impresión y publicidad en Bolivia, reconocida por nuestra innovación tecnológica, calidad superior y servicio al cliente inigualable. Queremos estar presentes en cada historia de éxito de nuestros clientes.', 'order' => 3],
        ];

        foreach ($abouts as $a) {
            AboutSection::firstOrCreate(['title' => $a['title']], array_merge($a, ['is_active' => true]));
        }

        $this->command->info('✅ Base de datos poblada exitosamente!');
        $this->command->info('👤 Admin: admin@megaprint.bo / password');
    }
}
