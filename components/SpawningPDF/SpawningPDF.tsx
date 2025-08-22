import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { SpawningForm, Animal, Specie, Tank, Monitoring } from '@/types/types';
import { User } from '@/types/user';

interface SpawningPDFProps {
  spawningForm: SpawningForm;
  user: User | null;
  animal: Animal | null;
  specie: Specie | null;
  tank: Tank | null;
  organizedMonitoring: Monitoring[];
}

export const generateSpawningPDF = async ({
  spawningForm,
  user,
  animal,
  specie,
  tank,
  organizedMonitoring,
}: SpawningPDFProps) => {
  // Criar um elemento temporário para renderizar o conteúdo
  const tempDiv = document.createElement('div');
  tempDiv.style.position = 'absolute';
  tempDiv.style.left = '-9999px';
  tempDiv.style.top = '0';
  tempDiv.style.width = '800px';
  tempDiv.style.backgroundColor = 'white';
  tempDiv.style.padding = '30px';
  tempDiv.style.fontFamily = 'Arial, sans-serif';
  tempDiv.style.color = '#333';
  tempDiv.style.lineHeight = '1.5';
  tempDiv.style.fontSize = '12px';

  // Conteúdo do PDF
  tempDiv.innerHTML = `
    <div style="text-align: center; margin-bottom: 40px; border-bottom: 2px solid #0a58ca; padding-bottom: 20px;">
      <h1 style="color: #0a58ca; margin: 0; font-size: 24px; font-weight: bold; text-transform: uppercase;">
        Relatório de Desova - Sistema de Controle de Piscicultura
      </h1>
      <p style="color: #666; margin: 10px 0 0 0; font-size: 14px;">
        Documento oficial de registro e acompanhamento do processo de desova
      </p>
    </div>

    <!-- Seção 1: Informações Básicas -->
    <div style="margin-bottom: 30px;">
      <h2 style="color: #0a58ca; font-size: 16px; margin-bottom: 15px; border-bottom: 1px solid #e0e0e0; padding-bottom: 5px;">
        1. INFORMAÇÕES BÁSICAS DA DESOVA
      </h2>
      
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <tr>
          <td style="width: 30%; padding: 8px; border: 1px solid #ddd; background: #f8f9fa; font-weight: bold;">Data da Desova:</td>
          <td style="width: 70%; padding: 8px; border: 1px solid #ddd;">
            ${spawningForm.date instanceof Date 
              ? spawningForm.date.toLocaleDateString("pt-BR") 
              : new Date(spawningForm.date).toLocaleDateString("pt-BR")}
          </td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd; background: #f8f9fa; font-weight: bold;">Peso dos Ovos:</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${spawningForm.egg_weight} kg</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd; background: #f8f9fa; font-weight: bold;">Peso Antes da Desova:</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${spawningForm.animal_weight.beforeSpawn} kg</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd; background: #f8f9fa; font-weight: bold;">Peso Depois da Desova:</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${spawningForm.animal_weight.afterSpawn} kg</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd; background: #f8f9fa; font-weight: bold;">Perda de Peso:</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${(spawningForm.animal_weight.beforeSpawn - spawningForm.animal_weight.afterSpawn).toFixed(2)} kg</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd; background: #f8f9fa; font-weight: bold;">Taxa de Perda de Peso:</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${((spawningForm.animal_weight.beforeSpawn - spawningForm.animal_weight.afterSpawn) / spawningForm.animal_weight.beforeSpawn * 100).toFixed(1)}%</td>
        </tr>
      </table>

      <div style="background: #f0f8ff; padding: 15px; border-left: 4px solid #0a58ca; margin-bottom: 20px;">
        <h4 style="margin: 0 0 10px 0; color: #0a58ca;">Informações do Hormônio</h4>
        <p style="margin: 0; font-size: 13px;">
          <strong>Dosagem:</strong> ${spawningForm.hormone.quantity} ml<br>
          <strong>Horário da Aplicação:</strong> ${spawningForm.hormone.hour_dosage}<br>
          <strong>Observação:</strong> O hormônio foi aplicado conforme protocolo estabelecido para indução da desova.
        </p>
      </div>
    </div>

    <!-- Seção 2: Informações do Responsável -->
    <div style="margin-bottom: 30px;">
      <h2 style="color: #0a58ca; font-size: 16px; margin-bottom: 15px; border-bottom: 1px solid #e0e0e0; padding-bottom: 5px;">
        2. RESPONSÁVEL TÉCNICO
      </h2>
      
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="width: 30%; padding: 8px; border: 1px solid #ddd; background: #f8f9fa; font-weight: bold;">Nome:</td>
          <td style="width: 70%; padding: 8px; border: 1px solid #ddd;">${user?.username || 'Não informado'}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd; background: #f8f9fa; font-weight: bold;">Email:</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${user?.email || 'Não informado'}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd; background: #f8f9fa; font-weight: bold;">Cargo:</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${user?.role || 'Não informado'}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd; background: #f8f9fa; font-weight: bold;">Data de Cadastro:</td>
          <td style="padding: 8px; border: 1px solid #ddd;">
            ${user?.createdAt 
              ? new Date(user.createdAt).toLocaleDateString("pt-BR") 
              : 'Não informado'}
          </td>
        </tr>
      </table>
    </div>

    <!-- Seção 3: Informações do Animal -->
    <div style="margin-bottom: 30px;">
      <h2 style="color: #0a58ca; font-size: 16px; margin-bottom: 15px; border-bottom: 1px solid #e0e0e0; padding-bottom: 5px;">
        3. INFORMAÇÕES DO ANIMAL
      </h2>
      
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="width: 30%; padding: 8px; border: 1px solid #ddd; background: #f8f9fa; font-weight: bold;">Código do Animal:</td>
          <td style="width: 70%; padding: 8px; border: 1px solid #ddd;">${animal?.codeAnimal || 'Não informado'}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd; background: #f8f9fa; font-weight: bold;">Espécie:</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${specie?.name || 'Não informado'}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd; background: #f8f9fa; font-weight: bold;">Gênero:</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${animal?.gender === "F" ? "Fêmea" : "Macho"}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd; background: #f8f9fa; font-weight: bold;">Data de Nascimento:</td>
          <td style="padding: 8px; border: 1px solid #ddd;">
            ${animal?.birthDate
              ? (typeof animal.birthDate === "string"
                  ? new Date(animal.birthDate)
                  : animal.birthDate
                ).toLocaleDateString("pt-BR")
              : "Não informado"}
          </td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd; background: #f8f9fa; font-weight: bold;">Código da Matriz:</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${animal?.matriz_code || "Não informado"}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd; background: #f8f9fa; font-weight: bold;">Tanque:</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${tank?.name || "Não informado"}</td>
        </tr>
      </table>
    </div>

    <!-- Seção 4: Monitoramento de Temperatura -->
    <div style="margin-bottom: 30px;">
      <h2 style="color: #0a58ca; font-size: 16px; margin-bottom: 15px; border-bottom: 1px solid #e0e0e0; padding-bottom: 5px;">
        4. MONITORAMENTO DE TEMPERATURA
      </h2>
      
      <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin-bottom: 15px;">
        <p style="margin: 0; font-size: 13px; color: #666;">
          <strong>Descrição:</strong> O monitoramento da temperatura é essencial durante o processo de desova para garantir 
          condições ideais para o desenvolvimento dos ovos. Os graus-hora são calculados automaticamente 
          somando a temperatura atual com os graus-hora anteriores, permitindo acompanhar a acumulação 
          térmica ao longo do tempo.
        </p>
      </div>
      
      ${organizedMonitoring.length > 0 ? `
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <thead>
            <tr style="background: #0a58ca; color: white;">
              <th style="padding: 10px; text-align: left; border: 1px solid #ddd; font-size: 12px;">Horário</th>
              <th style="padding: 10px; text-align: left; border: 1px solid #ddd; font-size: 12px;">Temperatura (°C)</th>
              <th style="padding: 10px; text-align: left; border: 1px solid #ddd; font-size: 12px;">Graus-Hora Acumulados</th>
            </tr>
          </thead>
          <tbody>
            ${organizedMonitoring.map((monitoring, index) => `
              <tr style="background: ${index % 2 === 0 ? '#ffffff' : '#f8f9fa'};">
                <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold; font-size: 11px;">${monitoring.hour}</td>
                <td style="padding: 8px; border: 1px solid #ddd; font-size: 11px;">${monitoring.temperature}°C</td>
                <td style="padding: 8px; border: 1px solid #ddd; font-size: 11px;">${monitoring.hour_degree}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div style="background: #e8f5e8; padding: 15px; border-left: 4px solid #28a745; margin-bottom: 20px;">
          <h4 style="margin: 0 0 10px 0; color: #28a745;">Análise do Monitoramento</h4>
          <p style="margin: 0; font-size: 13px;">
            <strong>Total de Registros:</strong> ${organizedMonitoring.length}<br>
            <strong>Temperatura Média:</strong> ${(organizedMonitoring.reduce((sum, m) => sum + m.temperature, 0) / organizedMonitoring.length).toFixed(1)}°C<br>
            <strong>Graus-Hora Finais:</strong> ${organizedMonitoring[organizedMonitoring.length - 1]?.hour_degree || 0}<br>
            <strong>Observação:</strong> O monitoramento foi realizado conforme protocolo, registrando as variações 
            de temperatura ao longo do processo de desova.
          </p>
        </div>
      ` : `
        <div style="background: #fff3cd; padding: 15px; border-left: 4px solid #ffc107; margin-bottom: 20px;">
          <h4 style="margin: 0 0 10px 0; color: #856404;">Atenção</h4>
          <p style="margin: 0; font-size: 13px;">
            Nenhum registro de monitoramento de temperatura foi encontrado para esta desova. 
            É recomendável realizar o monitoramento em futuras desovas para melhor controle do processo.
          </p>
        </div>
      `}
    </div>

    <!-- Seção 5: Estatísticas e Análise -->
    <div style="margin-bottom: 30px;">
      <h2 style="color: #0a58ca; font-size: 16px; margin-bottom: 15px; border-bottom: 1px solid #e0e0e0; padding-bottom: 5px;">
        5. ESTATÍSTICAS E ANÁLISE
      </h2>
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
        <div style="background: #f0f8ff; padding: 15px; border: 1px solid #0a58ca; border-radius: 5px;">
          <h4 style="margin: 0 0 10px 0; color: #0a58ca; font-size: 14px;">Taxa de Perda de Peso</h4>
          <p style="margin: 0; font-size: 20px; font-weight: bold; color: #0a58ca;">
            ${((spawningForm.animal_weight.beforeSpawn - spawningForm.animal_weight.afterSpawn) / spawningForm.animal_weight.beforeSpawn * 100).toFixed(1)}%
          </p>
          <p style="margin: 5px 0 0 0; font-size: 11px; color: #666;">
            Percentual de peso perdido durante o processo de desova
          </p>
        </div>
        
        <div style="background: #f0fff0; padding: 15px; border: 1px solid #28a745; border-radius: 5px;">
          <h4 style="margin: 0 0 10px 0; color: #28a745; font-size: 14px;">Relação Ovos/Peso Perdido</h4>
          <p style="margin: 0; font-size: 20px; font-weight: bold; color: #28a745;">
            ${(spawningForm.egg_weight / (spawningForm.animal_weight.beforeSpawn - spawningForm.animal_weight.afterSpawn)).toFixed(2)}
          </p>
          <p style="margin: 5px 0 0 0; font-size: 11px; color: #666;">
            Eficiência da conversão de peso em ovos
          </p>
        </div>
      </div>
      
      <div style="background: #f8f9fa; padding: 15px; border-radius: 5px;">
        <h4 style="margin: 0 0 10px 0; color: #333; font-size: 14px;">Conclusões Técnicas</h4>
        <ul style="margin: 0; padding-left: 20px; font-size: 13px;">
          <li>A desova foi realizada com sucesso, resultando em ${spawningForm.egg_weight} kg de ovos</li>
          <li>A perda de peso de ${(spawningForm.animal_weight.beforeSpawn - spawningForm.animal_weight.afterSpawn).toFixed(2)} kg está dentro dos parâmetros esperados</li>
          <li>O processo foi conduzido pelo responsável técnico ${user?.username || 'não identificado'}</li>
          <li>${organizedMonitoring.length > 0 ? `O monitoramento de temperatura foi realizado com ${organizedMonitoring.length} registros` : 'Não foi realizado monitoramento de temperatura'}</li>
        </ul>
      </div>
    </div>

    <!-- Rodapé -->
    <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 2px solid #e0e0e0; color: #666; font-size: 11px;">
      <p style="margin: 0;">
        <strong>Relatório gerado em:</strong> ${new Date().toLocaleDateString("pt-BR")} às ${new Date().toLocaleTimeString("pt-BR")}
      </p>
      <p style="margin: 5px 0 0 0;">
        <strong>Sistema de Controle de Piscicultura - Fisher Control</strong><br>
        Documento oficial para fins de controle e acompanhamento
      </p>
    </div>
  `;

  document.body.appendChild(tempDiv);

  try {
    // Capturar o elemento como imagem
    const canvas = await html2canvas(tempDiv, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: 800,
      height: tempDiv.scrollHeight,
    });

    // Criar PDF
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    const imgWidth = 210; // Largura A4
    const pageHeight = 297; // Altura A4 (corrigida)
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    let position = 0;

    // Adicionar primeira página
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Adicionar páginas adicionais se necessário
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    // Gerar nome do arquivo
    const fileName = `relatorio_desova_${animal?.codeAnimal || 'animal'}_${new Date(spawningForm.date).toISOString().split('T')[0]}.pdf`;
    
    // Baixar PDF
    pdf.save(fileName);

  } catch (error) {

    alert('Erro ao gerar PDF. Tente novamente.');
  } finally {
    // Remover elemento temporário
    document.body.removeChild(tempDiv);
  }
}; 