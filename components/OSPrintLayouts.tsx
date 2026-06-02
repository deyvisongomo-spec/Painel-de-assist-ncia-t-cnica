import React from 'react';

interface OSPrintLayoutsProps {
  printFormat: '80mm' | 'a4';
  config: any;
  initialData: any;
  formData: any;
  selectedClientData: any;
  totalOS: number;
}

export const OSPrintLayouts: React.FC<OSPrintLayoutsProps> = ({
  printFormat,
  config,
  initialData,
  formData,
  selectedClientData,
  totalOS
}) => {
  return (
    <>
      <style>{`
        @media print {
          @page { margin: 0; size: auto; }
          body { background: white !important; -webkit-print-color-adjust: exact; margin: 0; padding: 0; }
          
          /* Esconde tudo que não for o container de impressão */
          body * { visibility: hidden; }
          .print-container, .print-container * { visibility: visible; }
          
          .print-container { 
            display: block !important; 
            position: absolute; 
            left: 0; 
            top: 0; 
            width: 100%;
            background: white; 
            color: black; 
            z-index: 9999;
          }
          
          /* Layout 80mm */
          .thermal-layout {
            width: 72mm; 
            padding: 2mm; 
            font-family: 'Helvetica', 'Arial', sans-serif; 
            font-size: 11pt;
            font-weight: 600;
            line-height: 1.25;
            color: #000 !important;
            display: ${printFormat === '80mm' ? 'block !important' : 'none !important'};
          }
          
          .thermal-layout * {
            font-family: 'Helvetica', 'Arial', sans-serif !important;
            color: #000 !important;
          }
          
          .thermal-layout div, .thermal-layout p, .thermal-layout span, .thermal-layout td, .thermal-layout th {
            color: #000 !important;
            -webkit-print-color-adjust: exact;
          }

          /* Layout A4 */
          .a4-layout {
            width: 210mm; 
            min-height: 297mm; 
            padding: 15mm; 
            font-family: 'Inter', sans-serif; 
            font-size: 11pt;
            color: #000 !important;
            display: ${printFormat === 'a4' ? 'block !important' : 'none !important'};
          }

          .print-logo { max-width: 150px; height: auto; margin-bottom: 10px; }
          .a4-header { border-bottom: 3px solid #000; padding-bottom: 20px; margin-bottom: 25px; display: flex; justify-content: space-between; align-items: start; }
          .section-title { font-weight: 900; text-transform: uppercase; font-size: 11px; color: #000; border-bottom: 2px solid #000; margin-bottom: 8px; padding-bottom: 4px; margin-top: 15px; }
          .table-full { width: 100%; border-collapse: collapse; margin: 15px 0; }
          .table-full th { background: #eee; color: #000; padding: 10px; text-align: left; text-transform: uppercase; font-size: 10px; border: 2px solid #000; }
          .table-full td { padding: 10px; border: 2px solid #000; font-size: 10pt; color: #000; }
          
          .info-box { border: 2px solid #000; padding: 12px; border-radius: 8px; margin-bottom: 15px; }
          .info-label { font-size: 9px; font-weight: 800; color: #000; text-transform: uppercase; display: block; margin-bottom: 2px; }
          .info-value { font-size: 11pt; font-weight: 600; color: #000; }
        }
      `}</style>

      {/* COMPONENTE DE IMPRESSÃO (OCULTO NA TELA) */}
      <div className="hidden print-container">
        
        {/* VIEW TÉRMICA (80mm) - ESTILO IMAGEM DO USUÁRIO */}
        <div className="thermal-layout">
          <div style={{fontSize: '10pt', paddingBottom: '10px', textAlign: 'center'}}>
            <h2 style={{fontWeight: '900', fontSize: '15pt', margin: '0 0 5px 0'}}>{config.name}</h2>
            <p style={{margin: '0 0 3px 0', fontSize: '10pt', fontWeight: 'bold'}}>{config.cnpj}</p>
            <p style={{margin: '0 0 3px 0', fontSize: '10pt', fontWeight: 'bold'}}>{config.address}</p>
            <p style={{margin: '0 0 3px 0', fontSize: '10pt', fontWeight: 'bold'}}>✉ {config.email}</p>
            <p style={{margin: '0 0 3px 0', fontSize: '11pt', fontWeight: 'bold'}}>📞 Fone: (31) 2028-1027 &nbsp; 📱 Whats: (31) 99554-9149</p>
            <p style={{margin: '0', fontSize: '10pt', fontWeight: 'bold'}}>👤 Resp: {config.responsible || '---'}</p>
          </div>

          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '2px dashed #000', borderBottom: '2px solid #000', padding: '8px 0', marginBottom: '10px'}}>
            <div style={{textAlign: 'center'}}>
              <p style={{margin: '0 0 2px 0', fontSize: '11pt'}}><b>Nº OS</b></p>
              <p style={{margin: '0', fontSize: '12pt', fontWeight: '900'}}>{initialData?.osNumber || '---'}</p>
            </div>
            <div style={{textAlign: 'center'}}>
              <p style={{margin: '0 0 2px 0', fontSize: '9pt'}}><b>Criação</b></p>
              <p style={{margin: '0', fontSize: '9pt', fontWeight: 'bold'}}>{initialData?.openedAt ? new Date(initialData.openedAt).toLocaleDateString('pt-BR') : new Date().toLocaleDateString('pt-BR')}<br/>{initialData?.openedAt ? new Date(initialData.openedAt).toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit'}) : new Date().toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit'})}</p>
            </div>
            <div style={{textAlign: 'center'}}>
              <p style={{margin: '0 0 2px 0', fontSize: '9pt'}}><b>Emissão</b></p>
              <p style={{margin: '0', fontSize: '9pt', fontWeight: 'bold'}}>{new Date().toLocaleDateString('pt-BR')}<br/>{new Date().toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit'})}</p>
            </div>
          </div>

          <div style={{margin: '12px 0 8px 0'}}>
            <h3 style={{fontSize: '13pt', fontWeight: '900', margin: '0 0 6px 0', textTransform: 'uppercase', borderBottom: '2px solid #000'}}>CLIENTE</h3>
            <p style={{margin: '0', fontSize: '14pt', fontWeight: '900'}}>{formData.clientName}</p>
            <div style={{display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '6px'}}>
              {selectedClientData?.cpfCnpj && <p style={{margin: '0', fontSize: '11pt', fontWeight: 'bold'}}>CPF/CNPJ: {selectedClientData.cpfCnpj}</p>}
              {selectedClientData?.phone && <p style={{margin: '0', fontSize: '11pt', fontWeight: 'bold'}}>Celular: {selectedClientData.phone}</p>}
            </div>
            {selectedClientData?.address && <p style={{margin: '6px 0 0 0', fontSize: '11pt', fontWeight: 'bold'}}>End: {selectedClientData.address.street}, {selectedClientData.address.number}, {selectedClientData.address.neighborhood}</p>}
          </div>

          <table style={{width: '100%', borderCollapse: 'collapse', marginTop: '10px', fontSize: '10pt', fontWeight: 'bold'}}>
            <thead>
              <tr style={{textAlign: 'left', textTransform: 'uppercase', borderBottom: '2px solid #000'}}>
                <th style={{padding: '4px 0'}}>STATUS</th>
                <th style={{padding: '4px 0'}}>DATA INICIAL</th>
                <th style={{padding: '4px 0', textAlign: 'right'}}>DATA FINAL</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{padding: '6px 0'}}><b>{formData.status}</b></td>
                <td style={{padding: '6px 0'}}>{initialData?.openedAt ? new Date(initialData.openedAt).toLocaleDateString('pt-BR') : new Date().toLocaleDateString('pt-BR')}</td>
                <td style={{padding: '6px 0', textAlign: 'right'}}>{initialData?.updatedAt ? new Date(initialData.updatedAt).toLocaleDateString('pt-BR') : '---'}</td>
              </tr>
            </tbody>
          </table>

          <div style={{marginTop: '12px', borderTop: '2px solid #000', paddingTop: '8px'}}>
            <p style={{margin: '0', fontSize: '13pt', fontWeight: '900'}}>DISPOSITIVO: {formData.model}</p>
            <div style={{display: 'flex', flexWrap: 'wrap', gap: '0 10px', marginTop: '4px'}}>
              {(formData.hasImei !== false && formData.imei) && <p style={{margin: '0', fontSize: '10pt', fontWeight: 'bold'}}>IMEI: {formData.imei}</p>}
              {(formData.hasImei === false && formData.imeiReason) && <p style={{margin: '0', fontSize: '10pt', fontWeight: 'bold'}}>IMEI N/A: {formData.imeiReason}</p>}
              {formData.color && <p style={{margin: '0', fontSize: '10pt', fontWeight: 'bold'}}>COR: {formData.color}</p>}
            </div>
          </div>

          <div style={{marginTop: '15px'}}>
            <p style={{margin: '0', fontWeight: '900', fontSize: '12pt', textTransform: 'uppercase'}}>DEFEITO RELATADO:</p>
            <p style={{margin: '4px 0 0 0', fontSize: '13pt', fontWeight: '900'}}>{formData.problemReported}</p>
          </div>

          <div style={{marginTop: '15px', borderTop: '2px dotted #000', paddingTop: '8px'}}>
            <p style={{margin: '0', fontWeight: '900', fontSize: '12pt', textTransform: 'uppercase'}}>OBSERVAÇÕES TÉCNICAS:</p>
            <div style={{fontSize: '11pt', fontWeight: 'bold', marginTop: '4px'}}>
              {formData.technicalDiagnosis && <p style={{margin: '4px 0'}}>Diagnóstico: {formData.technicalDiagnosis}</p>}
              {formData.servicesToExecute && <p style={{margin: '4px 0'}}>Serviços: {formData.servicesToExecute}</p>}
              {formData.parts.length > 0 && (
                <div style={{marginTop: '6px'}}>
                  <p style={{margin: '0', fontWeight: '900', fontSize: '11pt'}}>PEÇAS:</p>
                  {formData.parts.map((p: any, i: number) => (
                    <p key={i} style={{margin: '0', fontSize: '10pt', fontWeight: 'bold'}}>- {p.name} (x{p.quantity})</p>
                  ))}
                </div>
              )}
              <div style={{marginTop: '12px', textAlign: 'right', borderTop: '3px solid #000', paddingTop: '6px'}}>
                <p style={{fontSize: '16pt', fontWeight: '900', margin: '0'}}>TOTAL: R$ {totalOS.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div style={{marginTop: '40px', fontSize: '10pt', fontWeight: 'bold'}}>
            <div style={{display: 'flex', flexDirection: 'column', gap: '30px'}}>
               <div style={{textAlign: 'center', borderTop: '2px solid #000', paddingTop: '8px'}}>
                <p style={{margin: 0, fontWeight: '900', textTransform: 'uppercase'}}>{formData.clientName}</p>
                <p style={{margin: 0, fontSize: '9pt'}}>Assinatura do Cliente</p>
              </div>
              <div style={{textAlign: 'center', borderTop: '2px solid #000', paddingTop: '8px'}}>
                <p style={{margin: 0, fontWeight: '900', textTransform: 'uppercase'}}>{config.responsible || config.name}</p>
                <p style={{margin: 0, fontSize: '9pt'}}>Técnico Responsável</p>
              </div>
            </div>
          </div>

          <div style={{marginTop: '25px', borderTop: '2px solid #000', paddingTop: '8px', textAlign: 'center'}}>
            <p style={{fontSize: '10pt', fontWeight: '900', margin: '0 0 6px 0'}}>TERMOS:</p>
            <p style={{fontSize: '9pt', lineHeight: '1.3', margin: 0, textAlign: 'justify', fontWeight: 'bold'}}>{config.terms}</p>
          </div>
          
          <p style={{fontSize: '8pt', textAlign: 'center', marginTop: '20px', color: '#000', fontWeight: 'bold'}}>Gerado via PainelCell - Gestão Inteligente - {new Date().getFullYear()}</p>
        </div>

        {/* VIEW A4 FORMAL */}
        <div className="a4-layout">
          <div className="a4-header">
            <div style={{display: 'flex', alignItems: 'center', gap: '20px'}}>
              {config.logo && <img src={config.logo} className="print-logo" style={{maxWidth: '100px'}} />}
              <div>
                <h1 style={{fontSize: '24pt', fontWeight: '900', color: '#0f172a', margin: 0}}>{config.name}</h1>
                <p style={{color: '#3b82f6', fontWeight: '800', textTransform: 'uppercase', fontSize: '10pt', margin: 0, letterSpacing: '1px'}}>Assistência Técnica Especializada</p>
              </div>
            </div>
            <div style={{textAlign: 'right', fontSize: '9pt', color: '#000'}}>
              <p style={{margin: '0 0 2px 0'}}><b>CNPJ:</b> {config.cnpj}</p>
              <p style={{margin: '0 0 2px 0'}}>{config.address}</p>
              <p style={{margin: '0 0 2px 0'}}><b>FONE:</b> (31) 2028-1027</p>
              <p style={{margin: '0'}}><b>WHATSAPP:</b> (31) 99554-9149</p>
            </div>
          </div>

          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', padding: '15px 25px', borderRadius: '12px', marginBottom: '25px', border: '1px solid #e2e8f0'}}>
            <div>
              <span style={{fontSize: '10px', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase', display: 'block'}}>Documento</span>
              <h2 style={{margin: 0, fontWeight: '900', color: '#0f172a'}}>ORDEM DE SERVIÇO {initialData?.osNumber ? `#${initialData.osNumber}` : '---'}</h2>
            </div>
            <div style={{textAlign: 'right'}}>
              <span style={{fontSize: '10px', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase', display: 'block'}}>Data de Emissão</span>
              <p style={{margin: 0, fontWeight: '800', fontSize: '12pt'}}>{new Date().toLocaleDateString('pt-BR')}</p>
            </div>
          </div>

          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '10px'}}>
            <div className="info-box">
              <p className="section-title" style={{marginTop: 0}}>Dados do Cliente</p>
              <span className="info-label">Nome Completo</span>
              <p className="info-value">{formData.clientName || '---'}</p>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '10px'}}>
                <div>
                  <span className="info-label">Telefone</span>
                  <p className="info-value" style={{fontSize: '10pt'}}>{selectedClientData?.phone || '---'}</p>
                </div>
                <div>
                  <span className="info-label">CPF/CNPJ</span>
                  <p className="info-value" style={{fontSize: '10pt'}}>{selectedClientData?.cpfCnpj || '---'}</p>
                </div>
              </div>
              {selectedClientData?.address && (
                <div style={{marginTop: '10px'}}>
                  <span className="info-label">Endereço</span>
                  <p className="info-value" style={{fontSize: '9pt', fontWeight: '500'}}>{selectedClientData.address.street}, {selectedClientData.address.number} - {selectedClientData.address.neighborhood}</p>
                </div>
              )}
            </div>

            <div className="info-box">
              <p className="section-title" style={{marginTop: 0}}>Dados do Equipamento</p>
              <span className="info-label">Dispositivo</span>
              <p className="info-value">{formData.model || '---'}</p>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '10px'}}>
                <div>
                  <span className="info-label">IMEI / Serial / Motivo Inválido</span>
                  <p className="info-value" style={{fontSize: '10pt'}}>
                    {formData.hasImei === false ? 
                      (`NÃO AVALIADO: ${formData.imeiReason || 'Sem motivo detalhado'}`) : 
                      (formData.imei || '---')
                    }
                  </p>
                </div>
                <div>
                  <span className="info-label">Cor / Cap.</span>
                  <p className="info-value" style={{fontSize: '10pt'}}>{formData.color || '---'} {formData.capacity}</p>
                </div>
              </div>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '10px'}}>
                <div>
                  <span className="info-label">Senha</span>
                  <p className="info-value" style={{fontSize: '10pt'}}>{formData.password || '---'}</p>
                </div>
                <div>
                  <span className="info-label">Acessórios Deixados</span>
                  <p className="info-value" style={{fontSize: '9pt', fontWeight: '500'}}>{formData.itemsLeft || 'Nenhum'}</p>
                </div>
              </div>
            </div>
          </div>

          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px'}}>
            <div>
              <p className="section-title">Relato do Cliente (Defeito)</p>
              <div style={{minHeight: '80px', border: '1px solid #e2e8f0', padding: '12px', borderRadius: '10px', fontSize: '10pt', color: '#475569'}}>
                {formData.problemReported || 'Nenhum relato específico.'}
              </div>
            </div>
            <div>
              <p className="section-title">Diagnóstico e Serviços</p>
              <div style={{minHeight: '80px', border: '1px solid #e2e8f0', padding: '12px', borderRadius: '10px', fontSize: '10pt', color: '#475569'}}>
                <p style={{margin: '0 0 5px 0'}}><b>Diagnóstico:</b> {formData.technicalDiagnosis || '---'}</p>
                <p style={{margin: 0}}><b>Serviços:</b> {formData.servicesToExecute || '---'}</p>
              </div>
            </div>
          </div>

          <p className="section-title">Serviços e Peças</p>
          <table className="table-full">
            <thead>
              <tr>
                <th>Descrição do Item / Serviço</th>
                <th style={{width: '60px', textAlign: 'center'}}>Qtd</th>
                <th style={{width: '100px', textAlign: 'right'}}>Unitário</th>
                <th style={{width: '100px', textAlign: 'right'}}>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Mão de Obra Técnica Especializada</td>
                <td style={{textAlign: 'center'}}>1</td>
                <td style={{textAlign: 'right'}}>R$ {formData.laborValue.toFixed(2)}</td>
                <td style={{textAlign: 'right'}}>R$ {formData.laborValue.toFixed(2)}</td>
              </tr>
              {formData.parts.map((p: any, i: number) => (
                <tr key={i}>
                  <td>{p.name}</td>
                  <td style={{textAlign: 'center'}}>{p.quantity}</td>
                  <td style={{textAlign: 'right'}}>R$ {p.unitPrice.toFixed(2)}</td>
                  <td style={{textAlign: 'right'}}>R$ {(p.unitPrice * p.quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={3} style={{padding: '15px 10px', textAlign: 'right', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '10px', color: '#94a3b8'}}>Valor Total do Investimento:</td>
                <td style={{padding: '15px 10px', textAlign: 'right', fontWeight: '900', fontSize: '18pt', color: '#0f172a'}}>R$ {totalOS.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>

          <div style={{marginTop: '20px', padding: '15px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', fontSize: '8.5pt', color: '#64748b', lineHeight: '1.4'}}>
            <p style={{fontWeight: '900', color: '#0f172a', textTransform: 'uppercase', marginBottom: '5px', fontSize: '9px'}}>Termos e Condições de Garantia:</p>
            <p style={{margin: 0}}>{config.terms}</p>
          </div>

          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', marginTop: '60px', textAlign: 'center'}}>
            <div>
              <div style={{borderTop: '1px solid #0f172a', paddingTop: '8px', fontSize: '9px', fontWeight: '900', textTransform: 'uppercase'}}>{config.name}</div>
              <p style={{fontSize: '8px', color: '#94a3b8', marginTop: '2px'}}>Assinatura do Técnico</p>
            </div>
            <div>
              <div style={{borderTop: '1px solid #0f172a', paddingTop: '8px', fontSize: '9px', fontWeight: '900', textTransform: 'uppercase'}}>{formData.clientName}</div>
              <p style={{fontSize: '8px', color: '#94a3b8', marginTop: '2px'}}>Assinatura do Cliente</p>
            </div>
          </div>
          
          <div style={{marginTop: '30px', textAlign: 'center', fontSize: '8px', color: '#cbd5e1', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px'}}>
            Gerado via PainelCell - Gestão Inteligente - {new Date().getFullYear()}
          </div>
        </div>
      </div>
    </>
  );
};
