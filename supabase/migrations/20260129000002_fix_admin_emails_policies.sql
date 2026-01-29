-- =====================================================
-- MIGRATION: Ajustar políticas de admin_emails_autorizados
-- Data: 2026-01-29
-- Descrição: Permitir inserções públicas para sincronização inicial
-- =====================================================

-- Remover políticas antigas restritivas
DROP POLICY IF EXISTS "Admins podem ver emails autorizados" ON admin_emails_autorizados;
DROP POLICY IF EXISTS "Admins podem adicionar emails autorizados" ON admin_emails_autorizados;
DROP POLICY IF EXISTS "Admins podem remover emails autorizados" ON admin_emails_autorizados;

-- Criar políticas mais permissivas para modo desenvolvimento
-- Em produção, você pode tornar mais restritivas

-- Permitir leitura pública (para verificar se email está autorizado)
CREATE POLICY "Permitir leitura pública de emails ativos"
  ON admin_emails_autorizados FOR SELECT
  USING (ativo = true);

-- Permitir inserção pública (para sincronização inicial do localStorage)
CREATE POLICY "Permitir inserção pública de emails"
  ON admin_emails_autorizados FOR INSERT
  WITH CHECK (true);

-- Permitir atualização pública (para desativar emails)
CREATE POLICY "Permitir atualização pública de emails"
  ON admin_emails_autorizados FOR UPDATE
  USING (true);

-- Permitir deleção pública (para remover emails)
CREATE POLICY "Permitir deleção pública de emails"
  ON admin_emails_autorizados FOR DELETE
  USING (true);

-- =====================================================
-- NOTA DE SEGURANÇA PARA PRODUÇÃO:
-- =====================================================
-- Estas políticas são permissivas para facilitar o desenvolvimento.
-- Em produção, considere:
-- 
-- 1. Usar Supabase Auth e verificar se usuário é admin
-- 2. Criar uma função RPC protegida para adicionar/remover emails
-- 3. Restringir INSERT/UPDATE/DELETE apenas para admins autenticados
-- 
-- Exemplo de política mais segura:
-- 
-- CREATE POLICY "Apenas admins autenticados podem inserir"
--   ON admin_emails_autorizados FOR INSERT
--   WITH CHECK (
--     auth.uid() IN (
--       SELECT id FROM admin_cadastros WHERE ativo = true
--     )
--   );
-- =====================================================

-- Adicionar comentário explicativo
COMMENT ON POLICY "Permitir leitura pública de emails ativos" ON admin_emails_autorizados 
  IS 'Permite verificar se um email está autorizado sem autenticação';

COMMENT ON POLICY "Permitir inserção pública de emails" ON admin_emails_autorizados 
  IS 'DESENVOLVIMENTO: Permite sincronização do localStorage. Restringir em produção!';
