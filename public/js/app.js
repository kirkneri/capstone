document.getElementById('otherCheckbox').addEventListener('change', function() {
    const otherGameField = document.getElementById('otherGameField');
    const otherGameInput = document.getElementById('otherGame');
  
    if (this.checked) {
      otherGameField.style.display = 'block';
      otherGameInput.setAttribute('required', 'true');
    } else {
      otherGameField.style.display = 'none';
      otherGameInput.removeAttribute('required');
    }
  });
  