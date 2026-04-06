INSERT INTO users (id, email, password_hash, name, created_at, updated_at)
VALUES (
    'a0000000-0000-0000-0000-000000000001',
    'admin@hirehub.com',
    '$2a$10$placeholder.not.a.real.hash.for.seed.data.only',
    'admin',
    NOW(),
    NOW()
) ON CONFLICT (email) DO NOTHING;

INSERT INTO jobs (id, title, description, company, location, salary_min, salary_max, is_active, posted_by, created_at, updated_at) VALUES
(
    'b0000000-0000-0000-0000-000000000001',
    'Desenvolvedora Ruby on Rails Senior',
    'Estamos procurando uma pessoa desenvolvedora Ruby on Rails com experiencia em APIs REST, testes automatizados e boas praticas de engenharia de software. Voce vai trabalhar em produtos que impactam milhoes de usuarios todos os dias.',
    'Papple Inc.',
    'Remoto',
    12000,
    18000,
    true,
    'a0000000-0000-0000-0000-000000000001',
    NOW(),
    NOW()
),
(
    'b0000000-0000-0000-0000-000000000002',
    'Engenheiro de Software Golang Pleno',
    'Buscamos uma pessoa engenheira de software com experiencia em Go para atuar no time de infraestrutura. Voce vai desenvolver microsservicos de alta performance, trabalhar com gRPC, Kubernetes e observabilidade.',
    'Noogle',
    'Sao Paulo, SP',
    10000,
    15000,
    true,
    'a0000000-0000-0000-0000-000000000001',
    NOW(),
    NOW()
),
(
    'b0000000-0000-0000-0000-000000000003',
    'Pessoa Desenvolvedora Frontend React',
    'Procuramos alguem apaixonado por interfaces incriveis para nosso time de produto. Voce vai criar experiencias de usuario com React, TypeScript e design system proprio. Valorizamos acessibilidade e performance.',
    'Netfleeks',
    'Remoto',
    8000,
    13000,
    true,
    'a0000000-0000-0000-0000-000000000001',
    NOW(),
    NOW()
),
(
    'b0000000-0000-0000-0000-000000000004',
    'DevOps Engineer',
    'Vaga para quem respira infraestrutura como codigo. Terraform, AWS, Docker, CI/CD pipelines e muito cafe. Voce vai garantir que nossos deploys sejam rapidos, seguros e sem drama.',
    'Amozon Web Surfaces',
    'Curitiba, PR',
    14000,
    20000,
    true,
    'a0000000-0000-0000-0000-000000000001',
    NOW(),
    NOW()
),
(
    'b0000000-0000-0000-0000-000000000005',
    'Analista de Dados Python',
    'Estamos montando um time de dados do zero! Buscamos alguem com experiencia em Python, pandas, SQL e visualizacao de dados. Voce vai transformar dados brutos em insights que guiam decisoes de negocio.',
    'Macrohard',
    'Belo Horizonte, MG',
    9000,
    14000,
    true,
    'a0000000-0000-0000-0000-000000000001',
    NOW(),
    NOW()
)
ON CONFLICT (id) DO NOTHING;
