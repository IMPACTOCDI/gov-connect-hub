import { Outlet } from "react-router-dom";

/**
 * Layout das rotas da área da empresa. O contexto de anúncios (EmpresaAnunciosProvider)
 * fica no nível do App para que o Catálogo também exiba os anúncios criados pelas empresas.
 */
export function EmpresaLayout() {
  return <Outlet />;
}
