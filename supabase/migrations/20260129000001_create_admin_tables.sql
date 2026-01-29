-- =====================================================
-- MIGRATION: Criar tabelas de administradores
-- Data: 2026-01-29
-- Descrição: Sistema de admins com emails autorizados e cadastros individuais
-- =====================================================

-- 1. Tabela de e-mails autorizados (whitelist)
CREATE TABLE IF NOT EXISTS admin_emails_autorizados (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  adicionado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  adicionado_por TEXT,
  ativo BOOLEAN DEFAULT true
);

-- 2. Tabela de cadastros de administradores
CREATE TABLE IF NOT EXISTS admin_cadastros (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  nome TEXT NOT NULL,
  senha_hash TEXT NOT NULL,
  telefone TEXT,
  cargo TEXT,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ultimo_acesso TIMESTAMP WITH TIME ZONE,
  ativo BOOLEAN DEFAULT true
);

-- 3. Tabela de logs de acesso admin
CREATE TABLE IF NOT EXISTS admin_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES admin_cadastros(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  acao TEXT NOT NULL, -- 'login', 'logout', 'cadastro', 'alteracao_senha'
  ip_address TEXT,
  user_agent TEXT,
  sucesso BOOLEAN DEFAULT true,
  mensagem TEXT,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- ÍNDICES para performance
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_admin_emails_email ON admin_emails_autorizados(email);
CREATE INDEX IF NOT EXISTS idx_admin_emails_ativo ON admin_emails_autorizados(ativo);
CREATE INDEX IF NOT EXISTS idx_admin_cadastros_email ON admin_cadastros(email);
CREATE INDEX IF NOT EXISTS idx_admin_cadastros_ativo ON admin_cadastros(ativo);
CREATE INDEX IF NOT EXISTS idx_admin_logs_admin_id ON admin_logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_logs_email ON admin_logs(email);
CREATE INDEX IF NOT EXISTS idx_admin_logs_criado_em ON admin_logs(criado_em);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE admin_emails_autorizados ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_cadastros ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_logs ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso para admin_emails_autorizados
-- Apenas admins cadastrados podem ver e gerenciar emails autorizados
CREATE POLICY "Admins podem ver emails autorizados" 
  ON admin_emails_autorizados FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM admin_cadastros 
    WHERE admin_cadastros.email = auth.jwt() ->> 'email' 
    AND admin_cadastros.ativo = true
  ));

CREATE POLICY "Admins podem adicionar emails autorizados" 
  ON admin_emails_autorizados FOR INSERT 
  WITH CHECK (EXISTS (
    SELECT 1 FROM admin_cadastros 
    WHERE admin_cadastros.email = auth.jwt() ->> 'email' 
    AND admin_cadastros.ativo = true
  ));

CREATE POLICY "Admins podem remover emails autorizados" 
  ON admin_emails_autorizados FOR DELETE 
  USING (EXISTS (
    SELECT 1 FROM admin_cadastros 
    WHERE admin_cadastros.email = auth.jwt() ->> 'email' 
    AND admin_cadastros.ativo = true
  ));

-- Políticas para admin_cadastros
-- Qualquer um pode criar cadastro se o email estiver autorizado (verificação no app)
CREATE POLICY "Permitir leitura pública de cadastros ativos" 
  ON admin_cadastros FOR SELECT 
  USING (ativo = true);

CREATE POLICY "Permitir inserção de novos cadastros" 
  ON admin_cadastros FOR INSERT 
  WITH CHECK (true); -- Verificação de autorização será feita no app

CREATE POLICY "Admins podem atualizar seu próprio cadastro" 
  ON admin_cadastros FOR UPDATE 
  USING (email = auth.jwt() ->> 'email');

-- Políticas para logs
CREATE POLICY "Admins podem ver todos os logs" 
  ON admin_logs FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM admin_cadastros 
    WHERE admin_cadastros.email = auth.jwt() ->> 'email' 
    AND admin_cadastros.ativo = true
  ));

CREATE POLICY "Permitir inserção de logs" 
  ON admin_logs FOR INSERT 
  WITH CHECK (true);

-- =====================================================
-- FUNÇÕES AUXILIARES
-- =====================================================

-- Função para atualizar o campo atualizado_em automaticamente
CREATE OR REPLACE FUNCTION atualizar_timestamp_modificacao()
RETURNS TRIGGER AS $$
BEGIN
  NEW.atualizado_em = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar timestamp em admin_cadastros
CREATE TRIGGER trigger_atualizar_admin_cadastros
  BEFORE UPDATE ON admin_cadastros
  FOR EACH ROW
  EXECUTE FUNCTION atualizar_timestamp_modificacao();

-- Função para registrar log de acesso
CREATE OR REPLACE FUNCTION registrar_log_admin(
  p_admin_id UUID,
  p_email TEXT,
  p_acao TEXT,
  p_sucesso BOOLEAN DEFAULT true,
  p_mensagem TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_log_id UUID;
BEGIN
  INSERT INTO admin_logs (admin_id, email, acao, sucesso, mensagem)
  VALUES (p_admin_id, p_email, p_acao, p_sucesso, p_mensagem)
  RETURNING id INTO v_log_id;
  
  RETURN v_log_id;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- DADOS INICIAIS
-- =====================================================

-- Inserir email admin inicial
INSERT INTO admin_emails_autorizados (email, adicionado_por) 
VALUES ('admin@impactocdi.com.br', 'SISTEMA_INICIAL')
ON CONFLICT (email) DO NOTHING;

-- =====================================================
-- COMENTÁRIOS NAS TABELAS
-- =====================================================

COMMENT ON TABLE admin_emails_autorizados IS 'Lista de e-mails autorizados a criar contas de administrador';
COMMENT ON TABLE admin_cadastros IS 'Cadastros completos de administradores com suas credenciais';
COMMENT ON TABLE admin_logs IS 'Logs de todas as ações administrativas para auditoria';

COMMENT ON COLUMN admin_emails_autorizados.email IS 'E-mail autorizado a criar conta admin';
COMMENT ON COLUMN admin_emails_autorizados.ativo IS 'Se false, o email não pode mais criar contas';
COMMENT ON COLUMN admin_cadastros.senha_hash IS 'Hash bcrypt da senha do administrador';
COMMENT ON COLUMN admin_cadastros.ultimo_acesso IS 'Última vez que o admin fez login';
COMMENT ON COLUMN admin_logs.acao IS 'Tipo de ação: login, logout, cadastro, alteracao_senha, etc';
