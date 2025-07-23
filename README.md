# antrian_app

Aplikasi ini menggunakan tech stack pada front end yaitu, React Js, Tailwind CSS, Material UI, axios, jspdf. Sedangkan pada backend menggunakan, Node Js, Express, jsonwebtoken, dan mongoose.
Integrasi front end dan back end menggunakan REST API. Adapun DB menggunakan mongodb. 
Pada aplikasi memiliki 3 halaman dengan route:
"/" : main halaman yang berisikan jumlah antrian dan pengambilan antrian,
"/login": halaman untuk login menuju halaman admin,
"/admin": halaman untuk mengecek antrian data dan mengubah status antrianya. Pada halaman admin harus sudah login terlebih dahulu jika belum, maka akan ke halaman login terlebih dahulu.

Login dapat menggunakan:
username: admin
password: admin123

Pada aplikasi ini terdapat 4 status yaitu:
"ACTIVE": Sedang di Proses, 
"WAITING": Menunggu antrian, 
"COMPLETE": Sudah Selesai, 
"INCOMPLETE": Tidak selesai

Logic yang ditanamkan adalah ketika ada tidak ada status active maka urutan selanjutnya atau yang terbaru akan menjadi active.

No urutan pada antrian tidak akan sama karena, models membuat bahwa field no_queue mengharuskan unique. Kemudian, sudah ditambahkan collection untuk menghitung jumlah antrian agar terbarukan.

Jawaban Pertanyaan Tambahan:
1. monolith atau microservice? Jelaskan pendapat Anda!

Menurut saya, arsitektur microservice merupakan pilihan yang tepat, terutama untuk pengembangan sistem aplikasi berskala besar. Salah satu keunggulan utamanya adalah ketika terjadi kegagalan pada salah satu layanan (service), hal tersebut tidak akan memengaruhi layanan lainnya, sehingga sistem secara keseluruhan tetap dapat berjalan dengan baik. Selain itu, dalam konteks kerja tim, microservice sangat mendukung pengembangan secara paralel. Sehingga proses pengembangan menjadi lebih efisien dan terorganisir.
 
2. MVC atau FE & BE dipisah? Jelaskan pendapat Anda! mana yg lebih baik 

Menurut pendapat saya, pendekatan pemisahan antara Frontend dan Backend lebih fleksibel dan skalabel. Dengan arsitektur ini, kita dapat menggunakan teknologi yang berbeda pada sisi frontend dan backend sesuai dengan kebutuhan masing-masing, sehingga memberikan keleluasaan dalam pengembangan. Selain itu, pemisahan ini juga lebih ideal untuk proyek jangka panjang yang dirancang untuk terus berkembang, baik dari sisi kompleksitas sistem maupun dari sisi jumlah anggota tim. Pendekatan ini memungkinkan pengelolaan kode yang lebih terstruktur, pengembangan paralel antar tim, serta kemudahan dalam melakukan pemeliharaan dan peningkatan performa sistem secara bertahap.

3. Jika data sudah mencapai jutaan data, bagaimana cara mengatasi query lambat? Silahkan tunjukkan pada 
code Anda. 
Jika data sudah banyak maka akan lebih baik jika ditambahkan db untuk menampung cache. Kemudian membuat fetching data sesuai kebutuhan dan lakukan dengan lazy query, sehingga hit api hanya saat dibutuhkan saja. Lalu, lakukan fetching data list menggunakan offset agar hanya menampilkan hanya dengan data yang dibutuhkan dan tidak mengambil semuanya sehingga tidak perlu mengambil data yang banyak, seperti yang saya lakukan pada data table pada halaman admin.
