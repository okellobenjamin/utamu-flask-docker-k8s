// static/js/main.js
document.addEventListener('DOMContentLoaded', function() {
    // Add Student Form Handling
    const addStudentBtn = document.getElementById('add-student');
    if (addStudentBtn) {
        addStudentBtn.addEventListener('click', async function() {
            const name = document.getElementById('name').value;
            const regNumber = document.getElementById('reg_number').value;
            const email = document.getElementById('email').value;
            
            if (!name || !regNumber) {
                alert('Name and Registration Number are required');
                return;
            }
            
            try {
                const response = await fetch('/api/students', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name: name,
                        reg_number: regNumber,
                        email: email
                    }),
                });
                
                if (response.ok) {
                    // Refresh the page to show the new student
                    window.location.reload();
                } else {
                    const errorData = await response.json();
                    alert(`Error: ${errorData.error}`);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred. Please try again.');
            }
        });
    }
    
    // Search functionality
    const searchInput = document.getElementById('search');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchValue = this.value.toLowerCase();
            const tableRows = document.querySelectorAll('#students-table tbody tr');
            
            tableRows.forEach(row => {
                const text = row.textContent.toLowerCase();
                if (text.includes(searchValue)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        });
    }
    
    // Add some futuristic animation to the homepage
    const homePage = document.querySelector('.home-page');
    if (homePage) {
        // Create a particle effect
        createParticleEffect();
    }
    
    function createParticleEffect() {
        const heroSection = document.querySelector('.hero');
        if (!heroSection) return;
        
        const particleContainer = document.createElement('div');
        particleContainer.className = 'particle-container';
        particleContainer.style.position = 'absolute';
        particleContainer.style.top = '0';
        particleContainer.style.left = '0';
        particleContainer.style.width = '100%';
        particleContainer.style.height = '100%';
        particleContainer.style.overflow = 'hidden';
        particleContainer.style.zIndex = '-1';
        
        heroSection.style.position = 'relative';
        heroSection.prepend(particleContainer);
        
        // Create a few floating dots for a tech feel
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.position = 'absolute';
            particle.style.width = `${Math.random() * 6 + 2}px`;
            particle.style.height = particle.style.width;
            particle.style.backgroundColor = '#03dac6';
            particle.style.borderRadius = '50%';
            particle.style.opacity = `${Math.random() * 0.5 + 0.1}`;
            
            // Random starting positions
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;
            
            // Animation properties
            particle.style.transition = 'transform 3s ease-in-out';
            particle.style.animation = `float ${Math.random() * 10 + 15}s infinite ease-in-out`;
            
            particleContainer.appendChild(particle);
            
            // Add keyframe animation dynamically
            if (i === 0) {
                const style = document.createElement('style');
                style.textContent = `
                    @keyframes float {
                        0% { transform: translate(0, 0); }
                        50% { transform: translate(${Math.random() * 50 - 25}px, ${Math.random() * 50 - 25}px); }
                        100% { transform: translate(0, 0); }
                    }
                `;
                document.head.appendChild(style);
            }
        }
    }
});