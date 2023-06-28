import { cultureMeasurementTakers } from "@services/api/cultureMeasurement/culture-measurement-api.types"

export const CMObjectiveType = {
  BUDAYA_JUARA: 'Penilaian Infrastruktur Budaya Juara',
  INFRASTRUKTUR: 'Kesiapan Infrastruktur Budaya',
  PELAKSANAAN: 'Pelaksanaan Project Budaya'
}

export type CMObjectiveModel = {
  cmoId: string
  cmoTitle: string
  cmoMaxAnswerred: number
  cmSubmittedTakers: number
  cmTakers: cultureMeasurementTakers[]
  isEnable: boolean
  color: string
  cmoLastModified: string
}


export const DaysType = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']