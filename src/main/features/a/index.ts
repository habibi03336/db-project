import makeConnection from './a1/makeConnection';
import csvToTable from './a1/csvToTable';
import readTables from './a2/readTables';
import scanTableFeature from './a2/scanTableFeature';
import mappingFK from './a2/mappingFK';
import deleteFeature from './a3/deleteFeature';
import mappingPK from './a2/mappingPK';
import readScanTable from './a3/readScanTable';
import readScanResult from './a3/readScanResult';
import modifyFeatureDataType from './a3/modifyFeatureDataType';

export default {
  modifyFeatureDataType,
  deleteFeature,
  makeConnection,
  csvToTable,
  readTables,
  scanTableFeature,
  mappingFK,
  mappingPK,
  readScanTable,
  readScanResult,
};
