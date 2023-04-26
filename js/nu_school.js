

var canvas = document.getElementById('canvas')
var images = document.getElementById('cert')

var ctx = canvas.getContext('2d')

var CreatePDFBtn = document.getElementById('CreatePDF-btn')
var downloadBtn = document.getElementById('download-btn')

var image = new Image()
image.crossOrigin="anonymous";
image.src = '/pdf/nu_school.png'

var ratio = image.width / image.height;
var width = canvas.width;
var height = width / ratio;

image.onload = function () {
    canvas.width = image.width;
    canvas.height = image.height;
    
    drawPDF();
}

async function get_json(url){
    const file = await fetch(url);
    const json = await file.json();
  
    return json;
}

async function drawPDF() {

    var data_scheme = await get_json("./json/nu.json");

    ctx.imageSmoothingEnabled = false;
    //ctx.clearRect(0, 0, canvas.width, canvas.height)
	ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
	
    ctx.font = '32px Sarabun'
	//ctx.fillStyle = '#000000'

    var id_scheme = document.getElementById("scheme").value;
	ctx.fillText(id_scheme, 475, 680)
    ctx.fillText(data_scheme[id_scheme], 705, 680)

    //คำนำหน้าผู้รับรอง ในกรณีปกติ
    var teacher_prefix = document.getElementById("teacher_prefix").value;
    if (teacher_prefix === "นาง"){
        ctx.fillText("______", 424, 785)
        //ctx.fillText("_____", 490, 785)

        ctx.fillText("___________", 550, 785)
    }
    else if (teacher_prefix === "นางสาว"){
        ctx.fillText("_____", 490, 785)
        ctx.fillText("______", 424, 785)

        //ctx.fillText("___________", 550, 785)
    }
    else if (teacher_prefix === "นาย"){
        ctx.fillText("_____", 490, 785)
        ctx.fillText("___________", 550, 785)

        //ctx.fillText("______", 424, 785)
    }
    
    //กรณีเป็นยศให้ใส่ในชื่อไป
    if (teacher_prefix === "สิบเอก"){
        ctx.fillText(teacher_prefix + document.getElementById("teacher_name").value, 700, 800)
    }else{
        ctx.fillText(document.getElementById("teacher_name").value, 700, 800)
    }

    ctx.fillText(document.getElementById("teacher_rank").value, 1290, 800)

    ctx.fillText("สวรรค์อนันต์วิทยา", 400, 870)
    ctx.fillText("สุโขทัย", 1200, 870)

    ctx.fillText(document.getElementById("student_name").value, 600, 948)

    //คำนำหน้าผู้ขอใบรับรอง
    var teacher_prefix = document.getElementById("student_prefix").value;
    if (teacher_prefix === "นาย"){
    ctx.fillText("___________", 431, 935)
    }
    else if (teacher_prefix === "นางสาว"){
    ctx.fillText("_______", 365, 935)
    }


    ctx.fillText("สวรรค์อนันต์วิทยา", 550, 1023)
    ctx.fillText("สวรรคโลก", 1250, 1023)
    ctx.fillText("สุโขทัย", 400, 1080)

}

function show_example(){
    document.getElementById("pdf_example").src = img_ex;

    document.getElementById("pdf_modal").classList.add("is-active");
}
document.getElementById("btn-close-moodal").addEventListener('click', function () {
    document.getElementById("pdf_modal").classList.remove("is-active");
});

function DownloadPDF(){
    var to_png = canvas.toDataURL('image/png');

    let width = 1700; 
    let height = 2200;

    //set the orientation
    if(width > height){
      pdf = new jsPDF('l', 'px', [width, height]);
    }
    else{
      pdf = new jsPDF('p', 'px', [height, width]);
    }
    //then we get the dimensions from the 'pdf' file itself
    width = pdf.internal.pageSize.getWidth();
    height = pdf.internal.pageSize.getHeight();
    pdf.addImage(to_png, 'PNG', 0, 0, width, height);
    pdf.save("หนังสือรับรองความประพฤติ-"+document.getElementById('scheme').value+".pdf");

}

async function list_scheme (){
    const data = await get_json("/json/nu.json");

    var html = "";
    let i = 1;
    for(x in data){
        html += "<option value='"+i+"'>"+data[i]+"</option>"
        if(i < 30){
            i += 1;
        }
    }

    document.getElementById("scheme").innerHTML += html;
    console.log(html)
    console.log(i);
}

CreatePDFBtn.addEventListener('click', function () {
    //ตรวจสอบข้อมูลที่ให้กรอกว่าไม่มีข้อมูลว่าง
    var scheme = document.getElementById("scheme").value;
    var student_prefix = document.getElementById("student_prefix").value;
    var student_name = document.getElementById("student_name").value;
    var teacher_prefix = document.getElementById("teacher_name").value;
    var teacher_rank = document.getElementById("teacher_rank").value;

    if(scheme !== "" && student_prefix !== "" && student_name !== "" && teacher_prefix !== "" && teacher_rank !== ""){
    drawPDF().then(() => {
        img_ex = canvas.toDataURL('image/png');
        show_example();
    })
    }else{
        Swal.fire({
            title: 'กรุณากรอกข้อมูลให้ครบถ้วน',
            icon:'error',
            showCloseButton: false,
            showCancelButton: false,
            confirmButtonText: 'รับทราบ',
            timer: 10000

    });
    }
})

downloadBtn.addEventListener('click', function () {
	DownloadPDF()
})
