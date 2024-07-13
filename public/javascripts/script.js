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

document.getElementById('deleteButton').addEventListener('click', function() {
    var button = document.getElementById('deleteConfirm');
    if (button.style.display === 'none' || button.style.display === '') {
        button.style.display = 'block';
        
    } else {
        button.style.display = 'none';
    }
});
document.getElementById('cancelDelete').addEventListener('click', function() {
    var button = document.getElementById('deleteConfirm');
    if (button.style.display === 'none' || button.style.display === '') {
        button.style.display = 'block';
        
    } else {
        button.style.display = 'none';
    }
});
