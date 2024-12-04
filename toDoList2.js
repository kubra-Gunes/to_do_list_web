let gorevGirisi = document.getElementById('inputListeElemani');//eklenmek için  yazılan göreve değişken tanımlıyorum
let ekleButton = document.getElementById('ekle');// ekle butonuna değişken tanımlıyorum
let temizleButton = document.getElementById('temizle');//temizle butonuna değişken tanımlıyorum
let araButton = document.getElementById('ara');  // Arama butonuna değişken tanımlıyorum
let eklenenGorevlerList = document.querySelector('.toDoList');//eklenmiş görevler için değişken tanımlıyorum(ul için)
let filterToDoList = document.querySelector('.filter-todo');// görevleri filtreleme seçenkeleri için değişken tanımlıyorum

// Sayfa yüklendiğinde mevcut görevlere buton ekle ve localStorage'teki görevleri yükle
document.addEventListener('DOMContentLoaded', () => {
    mevcutGorevlereButonEkle();
    loadTasks(); // Sayfa yüklendiğinde görevleri localStorage'ten yükleyen fonksiyonu çağır
});

// Butonlara olay ekleyiciler atıyoruz
ekleButton.addEventListener('click', gorevEkle);//ekle butonuna tıklandığında görev ekle fonksiyonunu çağır
temizleButton.addEventListener('click', gorevlerinTumunuSil);//temizle butonuna tıklandığında görevlerin tümünü silen fonksiyonu çağır
araButton.addEventListener('click', gorevFiltrele); // Arama butonuna filtreleme ekledik
filterToDoList.addEventListener('change', gorevFiltrele); // Filtre değişikliğinde fonksiyon çalışacak

// Mevcut görevlere "check" ve "sil" butonlarını eklemek için fonksiyon
function mevcutGorevlereButonEkle() {
    let mevcutGorevler = document.querySelectorAll('.toDoList li');// görevleri bulunduran her liste elemanı için bir değişken oluşturuyorum

    mevcutGorevler.forEach(gorev => {// görevler üzerinde gezinmek için döngü başlatıyorum
        if (!gorev.querySelector('.check-btn')) {//eğer göreve buton eklemesi yapılmadıysa 

            let checkButton = document.createElement('i');// fontawesome ikonlarını göstermek için <i> öğesi oluşturuluyor
            checkButton.classList.add('fa-solid', 'fa-check', 'check-btn');//kullanacağım butona sınıflarını ekliyorum(çünkü fontawesome butonları sınıflarla çağrılıyor)
            checkButton.style.cursor = "pointer";//üzerine gelindiğinde fare imlecinin "işaretçi" olması sağlanır

            let deleteButton = document.createElement('i');// fontawesome ikonlarını göstermek için <i> öğesi oluşturuluyor
            deleteButton.classList.add('fa-solid', 'fa-x', 'delete-btn');//kullanacağım butona sınıflarını ekliyorum(çünkü fontawesome butonları sınıflarla çağrılıyor)
            deleteButton.style.cursor = "pointer";//üzerine gelindiğinde fare imlecinin "işaretçi" olması sağlanır

            gorev.prepend(checkButton); // Sol tarafa ekle
            gorev.append(deleteButton); // Sağ tarafa ekle

            // Check butonuna tıklandığında görevi tamamlanmış olarak işaretle
            checkButton.addEventListener('click', () => {
                gorev.classList.toggle('completed'); // Tamamlanmış/tamamlanmamış durumunu değiştir
                saveTasks(); // Durum değiştiğinde görevleri kaydet
            });

            // Delete butonuna tıklandığında görevi sil
            deleteButton.addEventListener('click', () => {
                gorev.remove();
                saveTasks(); // Görev silindiğinde kaydet
            });
        }
    });
}

// Görev ekleme fonksiyonu
function gorevEkle(event) {
    event.preventDefault(); //olayın tarayıcıdaki varsayılan davranışını engeller.

    let gorevText = gorevGirisi.value.trim();//girilen görevin baştaki ve sondaki boşluklarını temizler
    if (gorevText === "") return;//boşluk eklemeyi engeller

    let gorev = document.createElement('li');// yeni bir <li> HTML elemanı(görev için) oluşturuluyor
    gorev.classList.add('gorev-styling');//oluşturulan <li> öğesine gorev-styling adlı bir CSS sınıfı ekleniyor
    gorev.innerText = gorevText;//gorev öğesinin içine gorevText adlı bir değişkenin değeri ekleniyor

    eklenenGorevlerList.appendChild(gorev);// oluşturduğum görevi (li) görev listemin(ul) elemanı yapıyorum
    gorevGirisi.value = "";// görev girişimi boşaltıyorum

    mevcutGorevlereButonEkle();//ekldiğim görevlere check ve delete butonlarını ekleyen fonksiyonu çağırdım.
   

    saveTasks(); // Yeni görev eklendiğinde görevleri kaydet
}

// Tüm yapılacakları silmek için fonksiyon
function gorevlerinTumunuSil() {
    while (eklenenGorevlerList.firstChild) {
        eklenenGorevlerList.removeChild(eklenenGorevlerList.firstChild);
    }
    saveTasks(); // Tüm görevler silindiğinde kaydet
}

// Filtreleme ve Arama fonksiyonu
function gorevFiltrele(event) {
    event.preventDefault();  // Arama butonuna basıldığında sayfanın yenilenmesini engeller
    let filtre = filterToDoList.value;//filtre seçeneğini alıyorum 
    let gorevler = document.querySelectorAll('.toDoList li');//tüm görevlerimi seçiyorum
    let searchQuery = gorevGirisi.value.trim().toLowerCase();//kullanıcının aradığı anahtar sözcüğü alır ve küçük harfe çevirir

    gorevler.forEach(gorev => {//görevler üzerinde gezinmeye başlıyorum
        let gorevMetni = gorev.innerText.toLowerCase();//eşleşme yaparken küçük büyük harf olmasın diye görevlerimi de küçük harf yapıyorum
        let isCompleted = gorev.classList.contains('completed');//filtreleme yaparak aranması ihtimaline karşı görevleri tamamlanmış veya tamamlanmamış olarak işaretledim
        let gorunur = true;//görünürlük başta true

        // Tamamlanma durumuna göre görünürlük uygula
        if (filtre === 'completed' && !isCompleted) gorunur = false;
        if (filtre === 'uncompleted' && isCompleted) gorunur = false;

        // Arama sorgusuna göre içerik kontrolü yap
        if (searchQuery && !gorevMetni.includes(searchQuery)) gorunur = false;

        gorev.style.display = gorunur ? '' : 'none';
    });
}

// Görevleri localStorage'e kaydet
function saveTasks() {
    let gorevler = [];//Boş bir dizi oluşturuyoruz. Bu dizi, tüm görevlerin bilgilerini tutacak.
    let listeElemanlari = document.querySelectorAll('.toDoList li');
    listeElemanlari.forEach(gorev => {
        gorevler.push({
            text: gorev.innerText,
            completed: gorev.classList.contains('completed')
        });
    });
    localStorage.setItem('tasks', JSON.stringify(gorevler));//Görevleri JSON formatında kaydediyoruz. localStorage'a kaydetmek için veriyi string hale getirmemiz gerektiğinden JSON.stringify kullanıyoruz.
}

// Sayfa yenilendiğinde localStorage'teki görevleri yükle
function loadTasks() {
    let storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];//LocalStorage'dan tasks anahtarına kaydedilmiş veriyi alır.
    storedTasks.forEach(task => {
        let gorev = document.createElement('li');
        gorev.classList.add('gorev-styling');
        if (task.completed) gorev.classList.add('completed');
        gorev.innerText = task.text;
        
        eklenenGorevlerList.appendChild(gorev);

        mevcutGorevlereButonEkle();

    });
}
