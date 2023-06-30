import { CMPublishDataModel, CMSectionModel, QuestionnaireModel, cultureMeasurementObjectiveModel, cultureMeasurementTakers } from "@services/api/cultureMeasurement/culture-measurement-api.types"

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


export const CM_OBJECTIVES_EMPTY: cultureMeasurementObjectiveModel = {
    cm_objective_id: '',
    cm_objective_title: '',
    cm_objective_max_answerred: 0,
    culture_measurement_takers: [],
    is_enable: false
}

export const CM_PUBLISH_EMPTY: CMPublishDataModel = {
    id: '',
    title: '',
    description: '',
    status: '',
    startDate: '',
    endDate: '',
    cm_created_at: '',
    cm_updated_at: '',
    cm_deleted_at: '',
    culture_measurement_objectives: []
}

export const CM_SECTION_EMPTY: CMSectionModel = {
    id: '',
    title: '',
    description: '',
    type: '',
    questionnaire: []
}


export const CM_SECTION_INFRA_MOCK_DATE: CMSectionModel[] = [
    {
        "id": "5a207ba6-f41f-4d2d-9c8f-5b9a8631e911",
        "title": "Petunjuk Pengisian",
        "description": "<p>Terdapat 33 pernyataan yang perlu Anda cermati terkait sejauh mana infrastruktur budaya yang ada saat ini, memadai untuk mendukung terlaksananya proyek-proyek Budaya Juara, beserta dengan 5 pilihan penilaian:</p><br>{{type_answer}}<br><p>Kemudian, Anda diminta untuk memberikan jawaban dengan cara meng-klik langsung simbol (O) pada skor penilaian yang Anda anggap paling tepat untuk menilai kesiapan infrastruktur budaya sesuai dengan kenyataan yang ditampilkan saat ini.</p>",
        "type": "example",
        "questionnaire": []
    },
    {
        "id": "d701cb80-b9ee-4b85-bd6f-c151400284ef",
        "title": "Concept Readiness",
        "description": "<p>Memiliki konsep Budaya Juara yang menyeluruh dan dipahami pihak terkait.</p>",
        "type": "questionnaire",
        "questionnaire": [
            {
                "item": "Mengajarkan pengetahuan tentang perilaku dan Budaya Juara kepada anggota tim54563",
                "description": "66666666666666666666666666fasdfasddd455dddddddddddddddddddddddasddfasd45e54448",
                "type": "likert_1"
            },
            {
                "item": "Memberikan pemahaman tentang keterkaitan antara pekerjaan yang dilakukan anggota tim dengan prinsip dan perilaku Juaraq",
                "description": "33",
                "type": "likert_1"
            },
            {
                "item": "Berbagi pengalaman dalam menghidupkan perilaku sesuai prinsip Budaya Juara.",
                "description": "",
                "type": "likert_1"
            },
            {
                "item": "Melakukan sesi Coaching dengan anggota Tim untuk mendukung Tim dalam menghidupkan perilaku sesuai prinsip Budaya Juara.",
                "description": "asdfasdf",
                "type": "likert_1"
            },
            {
                "description": "",
                "item": "",
                "type": "likert_1"
            },
            {
                "description": "",
                "item": "",
                "type": "likert_1"
            },
            {
                "description": "",
                "item": "",
                "type": "likert_1"
            },
            {
                "description": "",
                "item": "",
                "type": "likert_1"
            },
            {
                "description": "",
                "item": "",
                "type": "likert_1"
            },
            {
                "description": "",
                "item": "",
                "type": "likert_1"
            },
            {
                "description": "",
                "item": "",
                "type": "likert_1"
            },
            {
                "description": "",
                "item": "",
                "type": "likert_1"
            },
            {
                "description": "",
                "item": "",
                "type": "likert_1"
            },
            {
                "description": "",
                "item": "",
                "type": "likert_1"
            },
            {
                "description": "",
                "item": "",
                "type": "likert_1"
            },
            {
                "description": "",
                "item": "",
                "type": "likert_1"
            },
            {
                "description": "",
                "item": "",
                "type": "likert_1"
            }
        ]
    },
    {
        "id": "af442772-4e73-4e6b-8445-c0fc2da965a5",
        "title": "Team Readiness",
        "description": "<p>Memiliki Winning Team dengan struktur dan pembagian tugas yang jelas, serta dibekali dengan pengetahuan dan keterampilan untuk melaksanakan tugasnya.</p>",
        "type": "questionnaire",
        "questionnaire": [
            {
                "item": "Mengajarkan pengetahuan tentang perilaku dan Budaya Juara kepada anggota tim",
                "description": "",
                "type": "likert_1"
            },
            {
                "item": "Memberikan pemahaman tentang keterkaitan antara pekerjaan yang dilakukan anggota tim dengan prinsip dan perilaku Juara",
                "description": "",
                "type": "likert_1"
            },
            {
                "item": "Berbagi pengalaman dalam menghidupkan perilaku sesuai prinsip Budaya Juara.",
                "description": "",
                "type": "likert_1"
            },
            {
                "item": "Melakukan sesi Coaching dengan anggota Tim untuk mendukung Tim dalam menghidupkan perilaku sesuai prinsip Budaya Juara.",
                "description": "",
                "type": "likert_1"
            }
        ]
    },
    {
        "id": "39723c02-3ab9-417c-87c9-f81a32aeda6c",
        "title": "Process Readiness",
        "description": "<p>Memiliki alur proses pengembangan budaya dari perencanaan, pelaksanaan, evaluasi dan tindak lanjut yang berjalan teratur dan sistematis. Proyek Budaya Juara adalah proyek yang dilakukan oleh Winning Team untuk mengimplementasi budaya juara</p>",
        "type": "questionnaire",
        "questionnaire": [
            {
                "item": "Mengajarkan pengetahuan tentang perilaku dan Budaya Juara kepada anggota timasdfasdf",
                "description": "asdf",
                "type": "likert_1"
            },
            {
                "item": "Memberikan pemahaman tentang keterkaitan antara pekerjaan yang dilakukan anggota tim dengan prinsip dan perilaku Juara",
                "description": "",
                "type": "likert_1"
            },
            {
                "item": "Berbagi pengalaman dalam menghidupkan perilaku sesuai prinsip Budaya Juara.",
                "description": "",
                "type": "likert_1"
            },
            {
                "item": "Melakukan sesi Coaching dengan anggota Tim untuk mendukung Tim dalam menghidupkan perilaku sesuai prinsip Budaya Juara.",
                "description": "",
                "type": "likert_1"
            }
        ]
    },
    {
        "id": "f8a4e7c7-bbc6-4bb7-8167-717d3ecca2c0",
        "title": "Digital Platform Readiness ",
        "description": "<p>Memiliki platform berbasis teknologi digital yang menghidupkan interaksi, komunikasi dan pemantauan aktivitas Budaya.</p>",
        "type": "questionnaire",
        "questionnaire": [
            {
                "item": "Mengajarkan pengetahuan tentang perilaku dan Budaya Juara kepada anggota tim",
                "description": "",
                "type": "likert_1"
            },
            {
                "item": "Memberikan pemahaman tentang keterkaitan antara pekerjaan yang dilakukan anggota tim dengan prinsip dan perilaku Juara",
                "description": "",
                "type": "likert_1"
            },
            {
                "item": "Berbagi pengalaman dalam menghidupkan perilaku sesuai prinsip Budaya Juara.",
                "description": "",
                "type": "likert_1"
            },
            {
                "item": "Melakukan sesi Coaching dengan anggota Tim untuk mendukung Tim dalam menghidupkan perilaku sesuai prinsip Budaya Juara.",
                "description": "",
                "type": "likert_1"
            }
        ]
    },
    {
        "id": "415a2b51-5e0d-4b2b-bef1-3bbee87fa777",
        "title": "Recognition Mechanism Readiness",
        "description": "<p>Memiliki mekanisme pemberian pengakuan atas pencapaian pelaksanaan Proyek Budaya Juara, yang terintegrasi ke dalam pengembangan karir.</p>",
        "type": "questionnaire",
        "questionnaire": [
            {
                "item": "Mengajarkan pengetahuan tentang perilaku dan Budaya Juara kepada anggota tim",
                "description": "",
                "type": "likert_1"
            },
            {
                "item": "Memberikan pemahaman tentang keterkaitan antara pekerjaan yang dilakukan anggota tim dengan prinsip dan perilaku Juara",
                "description": "",
                "type": "likert_1"
            },
            {
                "item": "Berbagi pengalaman dalam menghidupkan perilaku sesuai prinsip Budaya Juara.",
                "description": "",
                "type": "likert_1"
            },
            {
                "item": "Melakukan sesi Coaching dengan anggota Tim untuk mendukung Tim dalam menghidupkan perilaku sesuai prinsip Budaya Juara.",
                "description": "",
                "type": "likert_1"
            }
        ]
    }
]

export const QUESTIONNAIRE_OPTION = [
    {
        text: 'Sangat tidak sesuai',
        color: 'ABM_YELLOW',
        fontColor: 'BLACK'
    },
    {
        text: 'Tidak sesuai',
        color: 'ABM_GREEN',
        fontColor: 'BLACK'
    },
    {
        text: 'Kurang sesuai',
        color: 'ABM_LIGHT_BLUE',
        fontColor: 'BLACK'
    },
    {
        text: 'Sesuai',
        color: 'ABM_DARK_BLUE',
        fontColor: 'WHITE'
    },
    {
        text: 'Sangat sesuai',
        color: 'BLACK',
        fontColor: 'WHITE'
    }
]

export const QUESTIONNAIRE_DATA = [
    {
        text: 'Penilaian Budaya Juara\n2/5 Orang',
        color: 'ABM_LIGHT_BLUE',
        lastModified: '2023-06-10T15:52:18.000Z',
        filled: 2,
        totalAll: 5
    },
    {
        text: 'Penilaian Infrastruktur\nBudaya Juara',
        color: 'ABM_YELLOW',
        lastModified: '2023-06-11T15:52:18.000Z',
        filled: 4,
        totalAll: 5
    },
    {
        text: 'Penilaian Pelaksanaan\nProyek Budaya',
        color: 'ABM_GREEN',
        lastModified: '2023-06-12T15:52:18.000Z',
        filled: 3,
        totalAll: 5
    }
]

export const QUESTIONNAIRE_COPY_WRITING: CMSectionModel[] = [
    {
        id: "71d49471-1af3-4862-b520-02445578e6a6",
        title: " ",
        description: "<p>Terima kasih atas kesediaan Anda untuk mengisi kuesioner Budaya Juara ini. Kuesioner ini dirancang untuk mengetahui sejauh mana peran para pemimpin dalam mengimplementasikan Budaya Juara. Kami berharap penilaian ini dilakukan seobyektif mungkin sehingga rekomendasi pengembangan para pemimpin akan menjadi lebih akurat.</p><br><p>Silakan mengisi kuesioner Budaya Juara ini satu kali per satu kuarter untuk menghasilkan hasil yang bermakna.</p>",
        type: "appraiser",
        questionnaire: []
    },
    {
        id: "a7447d46-dec4-4edf-95d7-1b54ff52c1b7",
        title: " ",
        description: "<p>Anda adalah {{user_position}} di dalam area/fungsi {{user_team}}. Silakan pilih nama individu yang akan Anda berikan penilaian.</p>",
        type: "rated_person",
        questionnaire: []
    },
    {
        id: "1a9fbcca-4671-4e01-ac80-cc0176aaa79b",
        title: "Petunjuk Pengisian",
        description: "<p>Terdapat {{count_questionnaire}} pernyataan yang perlu Anda cermati terkait tugas dan tanggung jawab pemimpin Juara, beserta dengan 5 pilihan penilaian:</p><br>{{questionnaire_type}}<br><p>Kemudian, Anda diminta untuk memberikan jawaban dengan cara meng-klik langsung simbol (O) pada skor penilaian yang Anda anggap paling tepat diberikan kepada pemimpin Juara sesuai dengan kenyataan yang ditampilkan saat ini.</p>",
        type: "example",
        questionnaire: []
    },
    {
        id: "a7a11f2a-890d-4e07-8032-38f7abcacbe7",
        title: "Live by the culture",
        description: "<p>Pada bagian ini, Anda akan melakukan penilaian mengenai bagaimana individu menampilkan Perilaku Budaya Juara dalam kegiatan sehari-hari di lingkungan kerja.</p>",
        type: "questionnaire",
        questionnaire: [
            {
                item: "Melaksanakan tugas dengan semangat untuk menunjukkan hasil terbaik.",
                description: "<p>Yang ditunjukkan dengan perilaku:<br>- Memotivasi diri dan orang lain untuk mencapai hasil terbaik.<br>- Senantiasa mengembangkan kemampuan diri.<br>- Proaktif memberikan penghargaan atas pencapaian kinerja.</p>",
                type: "likert_1"
            },
            {
                item: "Membangun kerjasama yang harmonis untuk melampaui target.",
                description: "",
                type: "likert_1"
            },
            {
                item: "Menciptakan perubahan  untuk menjadi yang terdepan.",
                description: "",
                type: "likert_1"
            },
            {
                item: "Mencurahkan seluruh kemampuan diri untuk hasil terbaik.",
                description: "",
                type: "likert_1"
            }
        ]
    },
    {
        id: "d4269123-48d6-4e77-a453-2cb47dba163d",
        title: "Communicate the Culture",
        description: "<p>Pada bagian ini, Anda akan melakukan penilaian mengenai bagaimana individu mengkomunikasikan Budaya Juara kepada tim.</p>",
        type: "questionnaire",
        questionnaire: [
            {
                item: "Memahami Prinsip-prinsip perilaku Juara dan penerapannya dalam keseharian kerja.",
                description: "",
                type: "likert_1"
            },
            {
                item: "Mampu menjelaskan prinsip-prinsip perilaku Juara kepada anggota tim.",
                description: "",
                type: "likert_1"
            },
            {
                item: "Mendiskusikan perilaku spesifik yang harus ditunjukkan oleh anggota tim dengan menggunakan prinsip Juara.",
                description: "",
                type: "likert_1"
            },
            {
                item: "Menginisiasi kegiatan untuk membantu anggota tim  mengingat prinsip dan perilaku Juara.",
                description: "",
                type: "likert_1"
            }
        ]
    },
    {
        id: "ce960661-443f-457a-ae80-b985efc10bdd",
        title: "Review Team Culture",
        description: "<p>Pada bagian ini, Anda akan melakukan penilaian mengenai bagaimana individu secara proaktif melakukan review terhadap Perilaku Budaya Juara yang ada pada Tim yang dipimpinnya.</p>",
        type: "questionnaire",
        questionnaire: [
            {
                item: "Melakukan pengamatan atas penerapan perilaku sesuai prinsip Juara pada anggota tim.",
                description: "",
                type: "likert_1"
            },
            {
                item: "Memberikan umpan balik kepada anggota tim atas pelaksanaan perilaku sesuai prinsip Juara yang telah dilaksanakan.",
                description: "",
                type: "likert_1"
            },
            {
                item: "Melakukan koordinasi dengan pihak terkait untuk mendukung penerapan perilaku sesuai prinsip Juara pada anggota tim.",
                description: "",
                type: "likert_1"
            },
            {
                item: "Memonitor tindakan perbaikan perilaku Juara.",
                description: "",
                type: "likert_1"
            }
        ]
    },
    {
        id: "42084bd5-c9f9-4c63-941f-185785df5c79",
        title: "Facilitate Culture Learning, Coaching, and Mentoring",
        description: "<p>Pada bagian ini, Anda akan melakukan penilaian mengenai bagaimana individu memfasilitasi Tim dalam mempelajari Perilaku Budaya Juara, serta melakukan coaching dan mentoring.</p>",
        type: "questionnaire",
        questionnaire: [
            {
                item: "Mengajarkan pengetahuan tentang perilaku dan Budaya Juara kepada anggota tim",
                description: "",
                type: "likert_1"
            },
            {
                item: "Memberikan pemahaman tentang keterkaitan antara pekerjaan yang dilakukan anggota tim dengan prinsip dan perilaku Juara",
                description: "",
                type: "likert_1"
            },
            {
                item: "Berbagi pengalaman dalam menghidupkan perilaku sesuai prinsip Budaya Juara.",
                description: "",
                type: "likert_1"
            },
            {
                item: "Melakukan sesi Coaching dengan anggota Tim untuk mendukung Tim dalam menghidupkan perilaku sesuai prinsip Budaya Juara.",
                description: "",
                type: "likert_1"
            }
        ]
    },
    {
        id: "c08d2845-07e2-4347-8fd0-d60dd68a1c0f",
        title: "Drive Culture to grow the Business",
        description: "<p>Pada bagian ini, Anda akan melakukan penilaian mengenai bagaimana individu memastikan bahwa Perilaku dan Proyek Budaya Juara dapat mendorong kinerja bisnis yang diharapkan.</p>",
        type: "questionnaire",
        questionnaire: [
            {
                item: "Mengajarkan pengetahuan tentang perilaku dan Budaya Juara kepada anggota tim",
                description: "",
                type: "likert_1"
            },
            {
                item: "Memberikan pemahaman tentang keterkaitan antara pekerjaan yang dilakukan anggota tim dengan prinsip dan perilaku Juara",
                description: "",
                type: "likert_1"
            },
            {
                item: "Berbagi pengalaman dalam menghidupkan perilaku sesuai prinsip Budaya Juara.",
                description: "",
                type: "likert_1"
            },
            {
                item: "Melakukan sesi Coaching dengan anggota Tim untuk mendukung Tim dalam menghidupkan perilaku sesuai prinsip Budaya Juara.",
                description: "",
                type: "likert_1"
            }
        ]
    }
]

export const QUESTIONNAIRE_EXAMPLE: QuestionnaireModel = {

    "item": "Konsep pengembangan Budaya Perusahaan telah disusun secara jelas dan mencakup seluruh aspek organisasi perusahaan.",
    "description": "",
    "type": "likert_1",
    "point": 2

}

export const GET_PUBLISH_MOCK_DATA = {
    "message": "success",
    "data": {
        "id": "2aec5d67-b1fd-4fa6-83ab-089d24922a60",
        "title": "Kuesioner Budaya Juara",
        "description": "<p>Terima kasih atas kesediaan Anda untuk mengisi kuesioner Budaya Juara ini. Kuesioner ini dirancang untuk mengetahui sejauh mana peran para pemimpin dalam mengimplementasikan Budaya Juara. Kuesioner ini dibagi menjadi tiga bagian dimana Anda perlu mengisi ketiga rangkaian penilaian agar kami dapat memperoleh nilai indeks yang sah. Silakan isi kuesioner sesuai dengan urutan berikut:</p><br>{{objective}}<p>Ketiga rangkaian kuesioner ini dapat disimpan di tengah-tengah pengisian, sehingga Anda dapat meninggalkan kuesioner apabila dibutuhkan dan kembali mengisi kuesioner di saat Anda memiliki kesempatan untuk mengisi kuesionernya kembali.<p><br><p>Kami berharap penilaian ini dilakukan seobyektif mungkin sehingga rekomendasi pengembangan para pemimpin akan menjadi lebih akurat. Silakan mengisi kuesioner Budaya Juara ini satu kali per satu kuarter untuk menghasilkan hasil yang bermakna.</p>",
        "status": "published",
        "startDate": "2023-06-21T17:00:00.000Z",
        "endDate": "2023-06-26T17:00:00.000Z",
        "cm_created_at": "2023-06-22T08:58:27.000Z",
        "cm_updated_at": "2023-06-22T09:10:44.000Z",
        "cm_deleted_at": null,
        "culture_measurement_objectives": [
            {
                "cm_objective_id": "c511ca4e-e6c5-4209-8ba7-4c8b11dcce6a",
                "cm_objective_title": "Penilaian Infrastruktur Budaya Juara",
                "cm_objective_max_answerred": 1,
                "culture_measurement_takers": [],
                "is_enable": true
            },
            {
                "cm_objective_id": "8502cd7b-6955-4610-b22d-1bdccf38c89e",
                "cm_objective_title": "Kesiapan Infrastruktur Budaya",
                "cm_objective_max_answerred": 1,
                "culture_measurement_takers": [],
                "is_enable": false
            },
            {
                "cm_objective_id": "17dbcd12-00ce-488a-a188-6e5b1166b190",
                "cm_objective_title": "Pelaksanaan Project Budaya",
                "cm_objective_max_answerred": 1,
                "culture_measurement_takers": [],
                "is_enable": false
            }
        ]
    }
}

export const CM_PUBLISH_MOCK_DATA: CMPublishDataModel = {
    "id": "2aec5d67-b1fd-4fa6-83ab-089d24922a60",
    "title": "Kuesioner Budaya Juara",
    "description": "<p>Terima kasih atas kesediaan Anda untuk mengisi kuesioner Budaya Juara ini. Kuesioner ini dirancang untuk mengetahui sejauh mana peran para pemimpin dalam mengimplementasikan Budaya Juara. Kuesioner ini dibagi menjadi tiga bagian dimana Anda perlu mengisi ketiga rangkaian penilaian agar kami dapat memperoleh nilai indeks yang sah. Silakan isi kuesioner sesuai dengan urutan berikut:</p><br>{{objective}}<p>Ketiga rangkaian kuesioner ini dapat disimpan di tengah-tengah pengisian, sehingga Anda dapat meninggalkan kuesioner apabila dibutuhkan dan kembali mengisi kuesioner di saat Anda memiliki kesempatan untuk mengisi kuesionernya kembali.<p><br><p>Kami berharap penilaian ini dilakukan seobyektif mungkin sehingga rekomendasi pengembangan para pemimpin akan menjadi lebih akurat. Silakan mengisi kuesioner Budaya Juara ini satu kali per satu kuarter untuk menghasilkan hasil yang bermakna.</p>",
    "status": "published",
    "startDate": "2023-06-21T17:00:00.000Z",
    "endDate": "2023-06-26T17:00:00.000Z",
    "cm_created_at": "2023-06-22T08:58:27.000Z",
    "cm_updated_at": "2023-06-22T09:10:44.000Z",
    "cm_deleted_at": null,
    "culture_measurement_objectives": [
        {
            "cm_objective_id": "c511ca4e-e6c5-4209-8ba7-4c8b11dcce6a",
            "cm_objective_title": "Penilaian Infrastruktur Budaya Juara",
            "cm_objective_max_answerred": 1,
            "culture_measurement_takers": [],
            "is_enable": true
        },
        {
            "cm_objective_id": "8502cd7b-6955-4610-b22d-1bdccf38c89e",
            "cm_objective_title": "Kesiapan Infrastruktur Budaya",
            "cm_objective_max_answerred": 1,
            "culture_measurement_takers": [],
            "is_enable": false
        },
        {
            "cm_objective_id": "17dbcd12-00ce-488a-a188-6e5b1166b190",
            "cm_objective_title": "Pelaksanaan Project Budaya",
            "cm_objective_max_answerred": 1,
            "culture_measurement_takers": [],
            "is_enable": false
        }
    ]
}

export const CM_SECTION_MOCK_DATA: CMSectionModel[] = [
    {
        "id": "d34c76e5-5e82-4e88-a10c-c1ced9c32dd0",
        "title": "Petunjuk Pengisian",
        "description": "<p>Terdapat 22 pernyataan yang perlu Anda cermati untuk menilai sejauh mana keberhasilan pelaksanaan proyek-proyek Budaya berdasarkan pengalaman dan observasi Anda selama menjalankan Budaya Juara, beserta dengan 5 pilihan penilaian:</p><br>{{type_answer}}<br><p>Kemudian, Anda diminta untuk memberikan jawaban dengan cara meng-klik langsung simbol (O) pada skor penilaian yang Anda anggap paling tepat untuk menilai pelaksanaan proyek-proyek Budaya sesuai dengan kenyataan yang ditampilkan saat ini.</p>",
        "type": "example",
        "questionnaire": []
    },
    {
        "id": "fa0752b2-6f79-450f-9848-39fb4c42aec2",
        "title": "Project Target Accuracy",
        "description": "<p>Proyek Budaya yang dilaksanakan menyasar perubahan perilaku yang berdampak pada KPI.</p>",
        "type": "questionnaire",
        "questionnaire": [
            {
                "item": "Mengajarkan pengetahuan tentang perilaku dan Budaya Juara kepada anggota tim63",
                "description": "2222222222222222222222222222222222dddssssssssssssssdddddddddddddd22222222222",
                "type": "likert_1"
            },
            {
                "item": "Memberikan pemahaman tentang keterkaitan antara pekerjaan yang dilakukan anggota tim dengan prinsip dan perilaku Juara",
                "description": "",
                "type": "likert_1"
            },
            {
                "item": "Berbagi pengalaman dalam menghidupkan perilaku sesuai prinsip Budaya Juara.",
                "description": "",
                "type": "likert_1"
            },
            {
                "item": "Melakukan sesi Coaching dengan anggota Tim untuk mendukung Tim dalam menghidupkan perilaku sesuai prinsip Budaya Juara.",
                "description": "",
                "type": "likert_1"
            },
            {
                "description": "",
                "item": "",
                "type": "likert_1"
            },
            {
                "description": "",
                "item": "",
                "type": "likert_1"
            }
        ]
    },
    {
        "id": "3de3c309-c819-4c5e-a355-66a3d25ad14a",
        "title": "Project Completion",
        "description": "<p>Proyek Budaya dilaksanakan dengan tuntas dan lengkap sesuai rencana proyek.</p>",
        "type": "questionnaire",
        "questionnaire": [
            {
                "item": "Mengajarkan pengetahuan tentang perilaku dan Budaya Juara kepada anggota tim",
                "description": "",
                "type": "likert_1"
            },
            {
                "item": "Memberikan pemahaman tentang keterkaitan antara pekerjaan yang dilakukan anggota tim dengan prinsip dan perilaku Juara",
                "description": "",
                "type": "likert_1"
            },
            {
                "item": "Berbagi pengalaman dalam menghidupkan perilaku sesuai prinsip Budaya Juara.",
                "description": "",
                "type": "likert_1"
            },
            {
                "item": "Melakukan sesi Coaching dengan anggota Tim untuk mendukung Tim dalam menghidupkan perilaku sesuai prinsip Budaya Juara.",
                "description": "",
                "type": "likert_1"
            }
        ]
    },
    {
        "id": "5c55d7af-3913-412b-b6f2-70441a3e20a5",
        "title": "Project Participation",
        "description": "<p>Proyek Budaya dilaksanakan dengan melibatkan dan mendapatkan dukungan dari Tim.</p>",
        "type": "questionnaire",
        "questionnaire": [
            {
                "item": "Mengajarkan pengetahuan tentang perilaku dan Budaya Juara kepada anggota tim",
                "description": "",
                "type": "likert_1"
            },
            {
                "item": "Memberikan pemahaman tentang keterkaitan antara pekerjaan yang dilakukan anggota tim dengan prinsip dan perilaku Juara",
                "description": "",
                "type": "likert_1"
            },
            {
                "item": "Berbagi pengalaman dalam menghidupkan perilaku sesuai prinsip Budaya Juara.",
                "description": "",
                "type": "likert_1"
            },
            {
                "item": "Melakukan sesi Coaching dengan anggota Tim untuk mendukung Tim dalam menghidupkan perilaku sesuai prinsip Budaya Juara.",
                "description": "",
                "type": "likert_1"
            }
        ]
    },
    {
        "id": "fcbf6bd6-a181-4c98-9ef8-3ffbc19dd843",
        "title": "Project Sustainability",
        "description": "<p>Proyek Budaya dapat dilaksanakan secara mandiri dan berkesinambungan.</p>",
        "type": "questionnaire",
        "questionnaire": [
            {
                "item": "Mengajarkan pengetahuan tentang perilaku dan Budaya Juara kepada anggota tim",
                "description": "4444444444444444444444444444444444444444444",
                "type": "likert_1"
            },
            {
                "item": "Memberikan pemahaman tentang keterkaitan antara pekerjaan yang dilakukan anggota tim dengan prinsip dan perilaku Juara",
                "description": "",
                "type": "likert_1"
            },
            {
                "item": "Berbagi pengalaman dalam menghidupkan perilaku sesuai prinsip Budaya Juara.",
                "description": "",
                "type": "likert_1"
            },
            {
                "item": "Melakukan sesi Coaching dengan anggota Tim untuk mendukung Tim dalam menghidupkan perilaku sesuai prinsip Budaya Juara.",
                "description": "",
                "type": "likert_1"
            }
        ]
    },
    {
        "id": "192c7d89-6156-4440-8593-615713e62ace",
        "title": "Project Replicability",
        "description": "<p>Proyek Budaya memiliki konsep yang dapat diduplikasi ke area kerja lain.</p>",
        "type": "questionnaire",
        "questionnaire": [
            {
                "item": "Mengajarkan pengetahuan tentang perilaku dan Budaya Juara kepada anggota tim",
                "description": "",
                "type": "likert_1"
            },
            {
                "item": "Memberikan pemahaman tentang keterkaitan antara pekerjaan yang dilakukan anggota tim dengan prinsip dan perilaku Juara",
                "description": "",
                "type": "likert_1"
            },
            {
                "item": "Berbagi pengalaman dalam menghidupkan perilaku sesuai prinsip Budaya Juara.",
                "description": "",
                "type": "likert_1"
            },
            {
                "item": "Melakukan sesi Coaching dengan anggota Tim untuk mendukung Tim dalam menghidupkan perilaku sesuai prinsip Budaya Juara.",
                "description": "",
                "type": "likert_1"
            }
        ]
    }
]

export const QUESTIONNAIRE_TYPE = [
    {
        text: 'Budaya Juara',
        color: 'ABM_LIGHT_BLUE'
    },
    {
        text: 'Infrastuktur Juara',
        color: 'ABM_YELLOW'
    },
    {
        text: 'Pelaksanaan Proyek Budaya',
        color: 'ABM_GREEN'
    }
]
