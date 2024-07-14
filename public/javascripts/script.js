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

function deletefunction(id) {
        var button = document.getElementById('deleteConfirm'+id);
        var backgroundPage = document.getElementById('backgroundPage');	
        if (button.style.display === 'none' || button.style.display === '') {
            button.style.display = 'block';
            //backgroundPage.style.filter = `blur(5px)`;
        } else {
            button.style.display = 'none';
        }
};

