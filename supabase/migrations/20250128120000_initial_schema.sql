-- Gov Connect Hub - Schema inicial do banco de dados
-- Executar no SQL Editor do Supabase ou via Supabase CLI

-- Extensão UUID (já existe por padrão no Supabase)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================================
-- 1. COMPRADORES (cadastro de entes públicos / compradores)
-- =============================================================================
CREATE TABLE IF NOT EXISTS compradores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  senha TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_compradores_email ON compradores (email);

-- =============================================================================
-- 2. EMPRESAS REGISTRO (cadastro de empresas - pendente/aprovado/rejeitado)
-- =============================================================================
CREATE TABLE IF NOT EXISTS empresas_registro (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL,
  senha TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'aprovado', 'rejeitado')),
  razao_social TEXT NOT NULL,
  nome_fantasia TEXT NOT NULL,
  cnpj TEXT NOT NULL,
  inscricao_estadual TEXT,
  endereco TEXT NOT NULL,
  numero TEXT NOT NULL,
  complemento TEXT,
  bairro TEXT NOT NULL,
  cidade TEXT NOT NULL,
  uf TEXT NOT NULL,
  cep TEXT NOT NULL,
  telefone TEXT NOT NULL,
  nome_contato TEXT NOT NULL,
  segmento TEXT NOT NULL,
  site TEXT,
  data_registro TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_empresas_registro_email ON empresas_registro (email);
CREATE INDEX IF NOT EXISTS idx_empresas_registro_status ON empresas_registro (status);

-- =============================================================================
-- 3. ADMIN EMAILS (e-mails autorizados a acessar como administrador)
-- =============================================================================
CREATE TABLE IF NOT EXISTS admin_emails (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================================================
-- 4. EMPRESAS CADASTRADAS (lista de empresas na gestão - ativo/pendente/excluído)
-- =============================================================================
CREATE TABLE IF NOT EXISTS empresas_cadastradas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  registro_id UUID REFERENCES empresas_registro (id) ON DELETE SET NULL,
  nome TEXT NOT NULL,
  segmento TEXT NOT NULL DEFAULT 'Outros',
  status TEXT NOT NULL DEFAULT 'Pendente aprovação' CHECK (status IN ('Ativo', 'Pendente aprovação', 'Excluído')),
  email TEXT,
  telefone TEXT,
  estado TEXT,
  cnpj TEXT,
  contato TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_empresas_cadastradas_registro_id ON empresas_cadastradas (registro_id);

CREATE INDEX IF NOT EXISTS idx_empresas_cadastradas_status ON empresas_cadastradas (status);

-- Nomes de empresas excluídas (lista para filtro)
CREATE TABLE IF NOT EXISTS empresas_excluidas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================================================
-- 5. ANÚNCIOS (produtos/serviços das empresas - catálogo)
-- =============================================================================
CREATE TABLE IF NOT EXISTS anuncios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  empresa_id UUID REFERENCES empresas_registro (id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  category TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('product', 'service')),
  state TEXT NOT NULL,
  has_ata BOOLEAN NOT NULL DEFAULT false,
  purchase_type TEXT NOT NULL CHECK (purchase_type IN ('Ata Disponível', 'Dispensa', 'Licitação')),
  image_url TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_anuncios_empresa_id ON anuncios (empresa_id);
CREATE INDEX IF NOT EXISTS idx_anuncios_category ON anuncios (category);
CREATE INDEX IF NOT EXISTS idx_anuncios_type ON anuncios (type);

-- =============================================================================
-- 6. DEMANDAS (manifestações de interesse)
-- =============================================================================
CREATE TABLE IF NOT EXISTS demandas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tipo TEXT NOT NULL CHECK (tipo IN ('Manifestação de interesse', 'Manifestação de interesse (Ata)')),
  origem TEXT NOT NULL,
  email TEXT NOT NULL,
  produto TEXT NOT NULL,
  produto_id TEXT NOT NULL,
  company TEXT NOT NULL,
  data TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Novo',
  mensagem TEXT,
  contato_nome TEXT,
  contato_telefone TEXT,
  uf TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_demandas_email ON demandas (email);
CREATE INDEX IF NOT EXISTS idx_demandas_company ON demandas (company);
CREATE INDEX IF NOT EXISTS idx_demandas_status ON demandas (status);

-- =============================================================================
-- 7. ATAS (atas de registro de preços)
-- =============================================================================
CREATE TABLE IF NOT EXISTS atas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  titulo TEXT NOT NULL,
  orgao TEXT NOT NULL,
  estado TEXT NOT NULL,
  categoria TEXT NOT NULL,
  modalidade TEXT NOT NULL,
  numero TEXT NOT NULL,
  vigencia_inicio TEXT NOT NULL,
  vigencia_fim TEXT NOT NULL,
  situacao TEXT NOT NULL CHECK (situacao IN ('Vigente', 'Encerrada')),
  valor_estimado TEXT,
  link_edital TEXT,
  descricao TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_atas_estado ON atas (estado);
CREATE INDEX IF NOT EXISTS idx_atas_situacao ON atas (situacao);
CREATE INDEX IF NOT EXISTS idx_atas_categoria ON atas (categoria);

-- =============================================================================
-- RLS (Row Level Security) - desabilitado por padrão para uso com service role
-- Quando integrar Supabase Auth, ative RLS e defina políticas por tabela.
-- =============================================================================
ALTER TABLE compradores ENABLE ROW LEVEL SECURITY;
ALTER TABLE empresas_registro ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE empresas_cadastradas ENABLE ROW LEVEL SECURITY;
ALTER TABLE empresas_excluidas ENABLE ROW LEVEL SECURITY;
ALTER TABLE anuncios ENABLE ROW LEVEL SECURITY;
ALTER TABLE demandas ENABLE ROW LEVEL SECURITY;
ALTER TABLE atas ENABLE ROW LEVEL SECURITY;

-- Políticas permissivas para anon e authenticated (ajuste depois com Auth)
-- Permite leitura/escrita para desenvolvimento; restrinja quando usar Auth.
CREATE POLICY "Permitir tudo compradores" ON compradores FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir tudo empresas_registro" ON empresas_registro FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir tudo admin_emails" ON admin_emails FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir tudo empresas_cadastradas" ON empresas_cadastradas FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir tudo empresas_excluidas" ON empresas_excluidas FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir tudo anuncios" ON anuncios FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir tudo demandas" ON demandas FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir tudo atas" ON atas FOR ALL USING (true) WITH CHECK (true);

-- Comentários nas tabelas
COMMENT ON TABLE compradores IS 'Compradores (entes públicos) cadastrados na plataforma';
COMMENT ON TABLE empresas_registro IS 'Cadastro de empresas - pendente, aprovado ou rejeitado';
COMMENT ON TABLE admin_emails IS 'E-mails autorizados a acessar como administrador';
COMMENT ON TABLE empresas_cadastradas IS 'Lista de empresas na gestão (ativo, pendente, excluído)';
COMMENT ON TABLE anuncios IS 'Produtos e serviços anunciados pelas empresas (catálogo)';
COMMENT ON TABLE demandas IS 'Manifestações de interesse de compradores';
COMMENT ON TABLE atas IS 'Atas de registro de preços disponíveis para adesão';
