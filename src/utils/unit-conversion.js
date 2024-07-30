import { DimensionUnit, WeightUnit } from "../constants";

export const getFormattedWeight = (weight, weightUnit) => {
    if (weightUnit === WeightUnit.GRAM) {
        return [{ weight: weight === 0 ? '0.00' : weight, unit: weightUnit }]
    } else if (weightUnit === WeightUnit.LB_OZ) {
        return [{
            weight: Math.floor(weight / 16),
            unit: 'lb'
        }, {
            weight: (weight % 16).toFixed(2),
            unit: 'oz'
        }]
    } else {
        return [{ weight: weight.toFixed(2), unit: weightUnit }]
    }
}

export const convertToThousands = (data) => {
   if (String(data).length >= 4) {
      return `${Math.round(data/1000)}K`;
   } else {
       return data;
   }
}

export const getFormattedDims = (value, dimensionUnit, precision) => {

    if (dimensionUnit === DimensionUnit.MM) {
        return convertToThousands(value || 0);
    }

    return Number(value || 0).toFixed(precision)
}