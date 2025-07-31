import { db } from './db'; 
export function calculatePump(formData) {
  // Cálculos reais devem ser implementados com fórmulas específicas
  const { wellDepth, tankHeight, pumpDistance, waterNeeded } = formData;
  
  // Cálculo simplificado para exemplo
  const totalHead = Number(wellDepth) + Number(tankHeight) + (Number(pumpDistance) * 0.1);
  const powerHP = Number(waterNeeded) * totalHead * 0.0004; // Fórmula simplificada corrigida
  
  let recommendedPump = '';
  if (powerHP < 1) recommendedPump = 'Bomba Solar XT-1000';
  else if (powerHP < 2) recommendedPump = 'Bomba Solar XT-2000';
  else if (powerHP < 5) recommendedPump = 'Bomba Solar XT-5000';
  else recommendedPump = 'Bomba Solar XT-10000';

  return {
    recommendedPump,
    power: powerHP.toFixed(1) + ' HP',
    flowRate: (Number(waterNeeded) / 24).toFixed(1) + ' m³/h',
    totalHead: totalHead.toFixed(1) + ' m',
    efficiency: '75%', // Valor estimado
    notes: `Sistema recomendado para vazão diária de ${waterNeeded} litros com altura manométrica total de ${totalHead.toFixed(1)} metros.`
  };
}

export function calculateSolarPanels(formData) {
  // Cálculos reais devem ser implementados com fórmulas específicas
  const { pumpPower, panelPower, isHybrid, city } = formData;
  
  // Cálculo simplificado para exemplo
  const dailyEnergyNeeded = Number(pumpPower) * 5; // 5 horas de uso diário
  const panelCount = Math.ceil(dailyEnergyNeeded / (Number(panelPower) * 0.8)); // Considerando 80% de eficiência
  
  return {
    recommendedPanels: `${panelCount} painéis de ${panelPower}W`,
    systemType: isHybrid ? 'Sistema Híbrido' : 'Sistema Off-Grid',
    estimatedProduction: `${(panelCount * Number(panelPower) * 0.8 * 5)} Wh/dia`, // Fórmula simplificada corrigida
    batteryRecommendation: isHybrid ? 'Não necessário' : 'Banco de baterias 48V 200Ah',
    notes: `Sistema dimensionado para ${city} considerando ${pumpPower}W de potência necessária.`
  };
}

export async function saveCalculation({
  userId,
  type,
  data,
  result,
}: {
  userId: string;
  type: string;
  data: any;
  result: any;
}) {
  return db.calculation.create({
    data: {
      userId,
      type,
      data: JSON.stringify(data),
      result: JSON.stringify(result),
    },
  });
}
