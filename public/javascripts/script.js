document.getElementById('singleButton').addEventListener('click', function() {
    var formular = document.getElementById('equipFormular');

    if (formular.style.display === 'none' || formular.style.display === '') {
        formular.style.display = 'block';
        
    } else {
        formular.style.display = 'none';
    }
});
document.getElementById('closeButton').addEventListener('click', function() {
    var formular = document.getElementById('equipFormular');
    if (formular.style.display === 'none' || formular.style.display === '') {
        formular.style.display = 'block';
        
    } else {
        formular.style.display = 'none';
    }
});
