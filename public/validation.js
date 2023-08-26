const imageUpload = document.getElementById('image')
const labelss = document.getElementById("y").innerText;
const labels = labelss.split(",");
Promise.all([
    faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
    faceapi.nets.faceExpressionNet.loadFromUri('/models'),
    faceapi.nets.ssdMobilenetv1.loadFromUri('/models')
  ]).then(faceExists)

   function faceExists(){
         const regform = document.getElementById("register_form");
         regform.addEventListener('submit',async (event)=>{
          document.getElementById('spinner').style.display = 'block';   
          event.preventDefault();
          const fileName = document.querySelector('#image').value;
          const extension = fileName.split('.').pop();
          console.log(extension)
          const rollno1 = document.getElementById("rollno").value;
           
          if(extension!="jpg"){
            alert("Upload jpg file")
            document.getElementById('spinner').style.display = 'none';
          }
           else if(labels.includes(rollno1)){
               
               alert("Roll number registered")
               document.getElementById('spinner').style.display = 'none';
           }else{
            const labeledFaceDescriptors = await loadLabeledImages()
            const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors)
          const image =await faceapi.bufferToImage(imageUpload.files[0])
         
          const resizedDetections = await faceapi.detectAllFaces(image).withFaceLandmarks().withFaceDescriptors()
          const results = resizedDetections.map(d => faceMatcher.findBestMatch(d.descriptor))
          if(results.length != 0){
            var label=results.toString().substr(0,results.toString().indexOf(' '));
            var dis = results.toString().substr(results.toString().indexOf("(")+1,results.toString().indexOf(")"));
            var dist= parseFloat(dis);
            if(dist<0.4){
                  
                  alert("User already exists")
                  document.getElementById('spinner').style.display = 'none'; 
             }
             else{
                 regform.submit()
             }
            
             
    
          }else{
             regform.submit()
          }
          }
        })
    
}
          
     

  

  function loadLabeledImages() {
    
    return Promise.all(
      labels.map(async label => {
        const descriptions = []
        const img = await faceapi.fetchImage(`./labeled_images/${label}.jpg`)
        const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()
        descriptions.push(detections.descriptor)
        return new faceapi.LabeledFaceDescriptors(label, descriptions)
      })
    )
  }
  