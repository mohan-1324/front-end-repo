const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');

signUpButton.addEventListener('click', () => {
  container.classList.add("right-panel-active");
});

signInButton.addEventListener('click', () => {
  container.classList.remove("right-panel-active");
});

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.sign-in-container form');

  // Create error elements under each field if not already present
  ['Name', 'Email', 'Phone Number', 'Currently working on'].forEach(placeholder => {
    const input = form.querySelector(`input[placeholder="${placeholder}"]`);
    if (input) {
      let errorSpan = document.createElement('span');
      errorSpan.className = 'error-message';
      errorSpan.style.color = 'red';
      errorSpan.style.fontSize = '14px';
      errorSpan.style.display = 'block';
      errorSpan.style.marginTop = '5px';
      input.insertAdjacentElement('afterend', errorSpan);
    }
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const nameInput = form.querySelector('input[placeholder="Name"]');
    const emailInput = form.querySelector('input[placeholder="Email"]');
    const phoneInput = form.querySelector('input[placeholder="Phone Number"]');
    const projectInput = form.querySelector('input[placeholder="Currently working on"]');

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const phone = phoneInput.value.trim();
    const project = projectInput.value.trim();

    // Clear all existing error messages
    form.querySelectorAll('.error-message').forEach(span => span.textContent = '');

    let valid = true;

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      emailInput.nextElementSibling.textContent = "Please enter a valid email.";
      valid = false;
    }

    // Indian mobile number validation (starts with 6-9 and 10 digits)
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      phoneInput.nextElementSibling.textContent = "Please enter a valid mobile number.";
      valid = false;
    }

    if (!name) {
      nameInput.nextElementSibling.textContent = "Please enter your name.";
      valid = false;
    }

    if (!project) {
      projectInput.nextElementSibling.textContent = "Please enter your project.";
      valid = false;
    }

    if (!valid) return;

    const formData = { name, email, phone, project };

    try {
      const response = await fetch('/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const message = await response.text();

      // Remove any old status message
      let oldStatus = form.querySelector('#status-message');
      if (oldStatus) oldStatus.remove();

      // Create new status message
      const statusMessage = document.createElement('span');
      statusMessage.id = 'status-message';
      statusMessage.style.display = 'block';
      statusMessage.style.marginTop = '10px';
      statusMessage.style.fontSize = '14px';

      if (response.ok) {
        form.reset();
        statusMessage.style.color = 'green';
        statusMessage.textContent = message || "Submitted";
      } else {
        statusMessage.style.color = 'red';
        statusMessage.textContent = message || "Submission failed.";
      }

      form.appendChild(statusMessage);

    } catch (error) {
      console.error('Submission error:', error);

      let oldStatus = form.querySelector('#status-message');
      if (oldStatus) oldStatus.remove();

      const errorMessage = document.createElement('span');
      errorMessage.id = 'status-message';
      errorMessage.style.display = 'block';
      errorMessage.style.marginTop = '10px';
      errorMessage.style.fontSize = '14px';
      errorMessage.style.color = 'red';
      errorMessage.textContent = "Failed to submit data.";

      form.appendChild(errorMessage);
    }
  });
});

