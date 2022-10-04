import React, { FC } from "react"
import {SafeAreaView, ScrollView} from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import { BackNavigation, Text } from "@components"
import { NavigatorParamList } from "@navigators/auth-navigator"
import {VStack} from "@components/view-stack";
import {Colors, Layout, Spacing} from "@styles";
import Spacer from "@components/spacer";
import {AuthBottomLogo} from "@components/auth-bottom-logo";

const TermsConds: FC<StackScreenProps<NavigatorParamList, "termsConds">> = observer(
  ({ navigation }) => {

    const goBack = () => {
      navigation.goBack()
    }

    return (
      <VStack
        testID="CoachingJournalMain"
        style={{ backgroundColor: Colors.WHITE, flex: 1, justifyContent: "center" }}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <BackNavigation color={Colors.UNDERTONE_BLUE} goBack={goBack} />
          <Text type={"header"} text="Selamat datang di iLEAD." />

          <ScrollView bounces={false}
                      style={[Layout.flex, Layout.heightFull, {margin: Spacing[12], borderWidth: Spacing[2], borderColor: Colors.UNDERTONE_BLUE, borderRadius: Spacing[16]}]}>
            <VStack top={Spacing[24]} horizontal={Spacing[24]} style={{backgroundColor: Colors.ABM_BG_BLUE}}>
              <Text type={"body"} text={TERMS_N_CONDITIONS} />
            </VStack>
          </ScrollView>
          <AuthBottomLogo top={0} />
          <Spacer height={Spacing[24]} />
        </SafeAreaView>
      </VStack>
    )
  },
)

export default TermsConds

const TERMS_N_CONDITIONS = "Perhatian! Sebagai pengguna aplikasi iLEAD, Anda wajib untuk membaca dan mengetahui syarat dan ketentuan penggunaan aplikasi ini secara seksama. Dengan menekan tombol “Setuju”, Anda mengakui dan menyetujui syarat dan ketentuan penggunaan yang berlaku. \n" +
  "\n" +
  "Syarat dan ketentuan penggunaan aplikasi iLEAD merupakan bentuk perjanjian yang sah antara pengembang aplikasi iLEAD (selanjutnya akan disebut sebagai Team iLEAD) dan Anda sebagai pengguna mengenai tata cara dan ketentuan penggunaan aplikasi ini.\n" +
  "\n" +
  "Syarat dan ketentuan penggunaan aplikasi iLEAD dapat berubah sewaktu-waktu. Jika ada perubahan atas syarat dan ketentuan penggunaan, Anda sebagai pengguna akan diberitahukan mengenai perubahan tersebut pada saat Anda mengakses aplikasi ini. \n" +
  "\n" +
  "Apabila Anda tidak menyetujui syarat dan ketentuan penggunaan ini, Anda diperbolehkan untuk menghapus aplikasi dan mengajukan permintaan untuk hapus akun (apabila sudah mendaftarkan diri di dalam aplikasi).\n" +
  "\n" +
  "I. KETENTUAN UMUM\n" +
  "\n" +
  "1. Aplikasi iLEAD merupakan aplikasi yang dikembangkan oleh pengembang aplikasi (developers) “Team iLEAD”. Proses riset, pengembangan ide, desain, serta pembangunan, penambahan dan peningkatan fitur dan fungsi aplikasi secara seutuhnya diawasi dan didukung oleh PT Kubik Cakrawala Internasional. Aplikasi iLEAD diserahkan kepada ABM Group di akhir tahap pengembangan aplikasi untuk digunakan sebagai aplikasi penunjang kegiatan pekerjaan karyawan dari perusahaan tersebut.\n" +
  "\n" +
  "2. Pengunduhan dan/atau penggunaan aplikasi iLEAD tidak dipungut biaya. Untuk proses pengunduhan aplikasi ini, diperlukan koneksi jaringan internet yang membutuhkan biaya tertentu. Biaya untuk koneksi jaringan internet ditanggung sepenuhnya oleh Anda sebagai pengguna.\n" +
  "\n" +
  "3. Seluruh fitur dan fungsi aplikasi iLEAD dapat digunakan setelah melakukan pendaftaran atau registrasi akun sebagaimana diminta dalam aplikasi (“Lengkapi profilmu.”). Untuk mendaftarkan diri di dalam aplikasi ini, diperlukan informasi terkait data pribadi Anda sebagai pengguna. Data pribadi yang Anda berikan hanya akan digunakan sebagai penunjang layanan fitur dan fungsi dari aplikasi ini.\n" +
  "\n" +
  "4. Aplikasi ini bertujuan untuk mendukung kegiatan Anda dalam lingkungan pekerjaan, khususnya untuk pekerjaan yang ditanggung jawabkan untuk ABM Group.\n" +
  "\n" +
  "II. KETENTUAN PENGGUNAAN\n" +
  "\n" +
  "1. Anda sebagai pengguna menjamin dan menyatakan bahwa Anda adalah individu yang secara hukum berhak untuk mengikatkan diri dalam perjanjian berdasarkan hukum negara Republik Indonesia sebagaimana “KETENTUAN PENGGUNAAN” ini ditentukan, untuk menggunakan aplikasi iLEAD. Apabila ketentuan-ketentuan yang tertera tidak terpenuhi, Team iLEAD, PT Kubik Cakrawala Internasional, dan ABM Group berhak menghapus akun Anda yang sudah terdaftar dan seluruh konten yang Anda unggah ke dalam aplikasi. Anda juga menyatakan dan menjamin bahwa Anda memiliki hak, wewenang, dan kapasitas untuk menggunakan seluruh fitur di dalam aplikasi ini dan mematuhi KETENTUAN PENGGUNAAN. \n" +
  "\n" +
  "2. Anda sebagai pengguna menyatakan bahwa Anda adalah individu yang bekerja di bawah naungan ABM Group dan memiliki jabatan serta wewenang untuk menggunakan aplikasi iLEAD. Anda tidak mendaftarkan diri melalui pihak lain dan/atau tidak menjadi pihak ketiga untuk mendaftarkan orang lain. Semua informasi dan \n" +
  "identitas yang Anda kirimkan ke dalam aplikasi ini merupakan identitas asli Anda sendiri.\n" +
  "\n" +
  "3. Apabila Anda kehilangan kendali atas akun Anda, Anda wajib untuk melaporkan kejadian tersebut kepada Team iLEAD. Anda sebagai pengguna tetap wajib bertanggung jawab atas setiap penggunaan akun di dalam aplikasi iLEAD meskipun Anda kehilangan kendali atas akun Anda.\n" +
  "\n" +
  "4. Team iLEAD tidak bertanggung jawab jika ada penyebaran mengenai identitas personal Anda termasuk kata sandi akun aplikasi Anda. Seluruh identitas personal Anda tidak pernah Team iLEAD ungkapkan pada pihak lain. Semua permintaan informasi yang diminta di dalam aplikasi merupakan permintaan yang sah danakan Team iLEAD lindungi kerahasiaannya. Permintaan informasi personal di luar aplikasi bukanlah tanggung jawab Team iLEAD.\n" +
  "\n" +
  "5. Seluruh konten yang Anda unggah pada aplikasi iLEAD tidak menjadi hak milik Team iLEAD, PT Kubik Cakrawala Internasional, dan ABM Group. Hak milik konten murni merupakan hak milik Anda sebagai pengguna dan harus dipertanggung jawabkan oleh Anda. Anda dilarang untuk mengunggah konten yang mengandung unsur suku, agama, ras, dan antargolongan (SARA), pornografi, dan isi lainnya yang melanggar hak kekayaan intelektual. Team iLEAD berhak melakukan penghapusan dan/atau pemblokiran atas hasil unggahan Anda apabila melanggar KETENTUAN PENGGUNAAN.\n" +
  "\n" +
  "6. Anda tidak diperkenankan untuk membahayakan, menyalahgunakan, mengubah, atau memodifikasi aplikasi iLEAD dengan cara apapun. Team iLEAD berhak menghentikan penggunaan atas akun Anda apabila Anda menggunakan aplikasi tidak sesuai dengan KETENTUAN PENGGUNAAN.\n" +
  "\n" +
  "7. Anda memahami dan setuju bahwa penggunaan aplikasi iLEAD juga dilindungi oleh KEBIJAKAN PRIVASI Team iLEAD dan dapat berubah sewaktu-waktu. Dengan menyetujui syarat dan penggunaan aplikasiini, Anda dianggap sudah memahami dan menyetujui KEBIJAKAN PRIVASI tersebut.\n" +
  "\n" +
  "8. Penggunaan fitur di dalam aplikasi iLEAD yang dilarang oleh hukum dan peraturan perundang-undangan negara Republik Indonesia sifatnya dilarang.\n" +
  "\n" +
  "III. KETENTUAN PENGGUNAAN FITUR\n" +
  "\n" +
  "1. Aplikasi ini merupakan moda bagi Anda sebagai pengguna untuk mengisi coaching journal, melakukan feedback terhadap diri sendiri sebagai coach dan terhadap coach, melihat catatan coaching journal coachee\n" +
  ", mengubah informasi personal seperti foto profil, e-mail, dan kata sandi, serta menerima notifikasi.\n" +
  "\n" +
  "2. Semua penggunaan fitur aplikasi iLEAD dilindungi oleh syarat dan ketentuan penggunaan aplikasi, termasuk KEBIJAKAN PRIVASI. Apabila Anda sebagai pengguna melanggar syarat dan ketentuan penggunaan aplikasi, Team iLEAD berhak untuk meenghentikan penggunaan atas akun Anda.\n" +
  "\n" +
  "3. Fitur notifikasi membutuhkan Anda untuk memperbolehkan perangkat Anda untuk dikirimkan notifikasi dari aplikasi pihak ketiga. Apabila Anda tidak memperbolehkan perangkat untuk mengirimkan notifikasi, Anda masih dapat menggunakan fitur lainnya di aplikasi iLEAD, namun tidak akan dapat menikmati fitur notifikasi.\n" +
  "\n" +
  "IV. JAMINAN DAN TANGGUNG JAWAB\n" +
  "\n" +
  "1. Team iLEAD terus melakukan pembaharuan dan menjaga fungsi aplikasi agar terus berjalan dengan lancar di perangkat Anda masing-masing. Namun, Team iLEAD tidak bertanggung jawab apabila aplikasi iLEAD beserta seluruh fiturnya tidak berfungsi atau tersedia yang ditimbulkan oleh kendala teknis yang berada di luar kendali Team iLEAD.\n" +
  "\n" +
  "2. Team iLEAD tidak bertanggung jawab atas kerugian yang dapat terjadi akibat hilangnya data termasuk namun tidak terbatas pada data personal Anda akibat penggunaan aplikasi iLEAD.\n" +
  "\n" +
  "3. Team iLEAD tidak bertanggung jawab atas konten yang Anda unggah atau unduh, serta penggunaan konten yang mungkin diperoleh dengan melanggar peraturan perundang-undangan negara Republik Indonesia.\n" +
  "\n" +
  "V. KEKAYAAN INTELEKTUAL\n" +
  "\n" +
  "1. Nama aplikasi dan logo “iLEAD” dilindungi oleh hak cipta dan hak lainnya berdasarkan hukum negara Republik Indonesia. Hak cipta yang dimaksud termasuk kepemilikan hak kekayaan intelektual atasseluruh kode sumber ( source code) aplikasi dan hak kekayaan inteleltual lain terkait aplikasi (termasuk sumber desain di dalam aplikasi). Anda dilarang untuk melakukan pelanggaran atas hak kekayaan intelektual Team iLEAD terkait aplikasi ini, termasuk melakukan modifikasi, karya turunan, mengadaptasi, menduplikasi, menyalin, membuat ulang, meretas, menjual, dan/atau mengeksploitasi aplikasi ini termasuk menggunakan aplikasi untuk akses yang tidak sah, meluncurkan program otomatis atau script untuk membuat permintaan server per detik, atau menciptakan beban berat, atau menghambat operasi dan/atau kinerja aplikasi, melakukan proses pengambilan “tambang data” ( data mine ), atau dengan cara apapun memperbanyak atau menghindari struktur navigasi atau presentasi dari aplikasi iLEAD serta isinya.\n" +
  "\n" +
  "2. Anda sebagai pengguna hanya diperbolehkan untuk menggunakan aplikasi semata-mata untuk kebutuhan pribadi Anda, non-komersial,tidak dapat dipindahtangankan, dan tidak dapat dialihkan.\n" +
  "\n" +
  "3. Seluruh syarat dan ketentuan penggunaan aplikasi iLEAD termasuk KEBIJAKAN PRIVASI diatur dan tunduk pada hukum negara Republik Indonesia. Team iLEAD memiliki hak sepenuhnya atas setiap pelanggaran yang Anda sebagai pengguna lakukan terhadap syarat dan ketentuan penggunaan aplikasi, dan hak milik kekayaan intelektual.\n" +
  "\n" +
  "VI. KEBIJAKAN PRIVASI\n" +
  "\n" +
  "1. Aplikasi iLEAD dapat mengumpulkan data pribadi Anda termasuk nama panjang, nama panggilan, e-mail, keanggotaan di dalam divisidi ABM Group, dan foto profil pada saat mendaftar dan/atau menggunakan fitur aplikasi iLEAD. \n" +
  "\n" +
  "2. Apabila Anda mengisi data pribadi Anda diluar aplikasi dan/atau selain di dalam kegiatan yang sudah disebutkan pada poin 1, maka Team iLEAD tidak dapat bertanggung jawab atas penyalah gunaan yang mungkin terjadi atas data pribadi yang Anda berikan.\n" +
  "\n" +
  "3. Team iLEAD berasumsi bahwa seluruh informasi yang Anda berikan saat ini dan perubahan-perubahan yang Anda mungkin akan lakukan di masa mendatang adalah akurat dan benar. Apabila informasi dan perubahan-perubahan yang diberikan ternyata terbukti tidak benar, maka Team iLEAD tidak bertanggung jawab atas segala akibat yang dapat terjadi sehubungan dengan pemberian informasi dan perubahan-perubahan yang tidak benar tersebut.\n" +
  "\n" +
  "4. Seluruh data pribadi Anda yang Team iLEAD peroleh akan disimpan di dalam sistem cloud database. Team iLEAD berupaya sedemikian rupa agar seluruh informasi yang ada dalam sistem tersebut dilindungi sesuai dengan undang-undang perlindungan data dan kebijakan privasi ini.\n" +
  "\n" +
  "5. Informasi mengenai data pribadi yang Anda berikan digunakan untuk penggunaan fitur dan kegiatan komunikasi dengan Anda apabila dibutuhkan.\n" +
  "\n" +
  "6. Team iLEAD tidak berhak untuk menjual, mendistribusikan, dan menyewakan data pribadi Anda kepada pihak ketiga, serta menggunakan data pribadi Anda untuk kepentingan lain selain yang disebutkan pada poin 5.\n" +
  "\n" +
  "7. Team iLEAD berhak menyimpan informasi pribadi Anda selama akunAnda masih terdaftar di dalam aplikasi iLEAD baik di dalam wilayah Republik Indonesia maupun di luar wilayan Republik Indonesia. Team iLEAD juga berhak untuk menghapus informasi pribadi Anda sesuai dengan ketentuan yang berlaku.\n" +
  "\n" +
  "VII. AKHIR\n" +
  "\n" +
  "1. Anda sebagai pengguna berhak untuk berhenti menggunakan aplikasi iLEAD setiap saat dengan cara menghapus akun dan secara permanen menghapus aplikasi dari perangkat Anda. Syarat dan ketentuan penggunaan aplikasi otomatis berakhir ketika Anda secara permanen menghapus aplikasi dari perangkat Anda.\n" +
  "\n" +
  "2. Apabila Anda merasa Team iLead telah melanggar persetujuan di dalam syarat dan penggunaan aplikasi ini, Anda berhak menuntut tanggung jawab Team iLEAD. Apabila Anda memiliki pertanyaan lebih lanjut, kritik, maupun saran mengenai syarat dan ketentuan penggunaan aplikasi iLEAD, silakan hubungi Team iLEAD melalui alamat e-mail ilead@kubik.co.id.\n" +
  "\n" +
  " \n"
