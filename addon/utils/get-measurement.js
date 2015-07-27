import { polygonArea, circleArea, rectangleArea } from './shape-area';
import commaifyNumber from './number-commas';
import squareMiles from './square-miles';
import miles from './miles';

export default function getMeasurement(type, feature) {
  var result = {
    measurementType: 'Distance',
    unit: 'ft',
    value: 0
  };

  switch(type) {
    case 'polyline': {
      let geometry = feature.getGeometry();
      let paths = geometry.getArray();
      let processed = [];

      paths.forEach((path) => {
        var lastIndex = processed.length ? processed.length - 1 : undefined;

        if (lastIndex !== undefined) {
          let last = processed[lastIndex];
          result.value += google.maps.geometry.spherical.computeDistanceBetween(last, path);
        }

        processed.push(path);
      });

      // meters->feet conversion
      result.value = result.value * 3.28084;
      result = miles(result);
      break;
    }

    case 'polygon': {
      let area = polygonArea(feature);
      // sq. meters-> sq. feet
      result.value = area * 10.7639;
      result.measurementType = 'Area';
      result.unit = 'sq. ft.';
      result = squareMiles(result);
      break;
    }

    case 'circle': {
      let area = circleArea(feature);

      result.value = area * 10.7639;
      result.measurementType = 'Area';
      result.unit = 'sq. ft.';
      result = squareMiles(result);
      break;
    }

    case 'rectangle': {
      let area = rectangleArea(feature);
      // sq. meters-> sq. feet
      result.value = area * 10.7639;
      result.measurementType = 'Area';
      result.unit = 'sq. ft.';
      result = squareMiles(result);
      break;
    }
  }

  result.value = commaifyNumber(result.value);

  return result;
}