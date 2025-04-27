let selectedTemplate = 1;

let resumeData = {
    personal: {},
    experience: [],
    education: [],
    skills: []
};

function createExperienceItem(data = {}) {
    const div = document.createElement('div');
    div.className = 'form-group experience-item';
    div.innerHTML = `
        <input type="text" class="exp-title" placeholder="Job Title" value="${data.title || ''}" maxlength="40" style="margin-bottom:0.5rem;">
        <input type="text" class="exp-company" placeholder="Company" value="${data.company || ''}" maxlength="40" style="margin-bottom:0.5rem;">
        <input type="text" class="exp-dates" placeholder="Dates (e.g. 2020-2022)" value="${data.dates || ''}" maxlength="30" style="margin-bottom:0.5rem;">
        <textarea class="exp-desc" placeholder="Description" rows="2" maxlength="200">${data.desc || ''}</textarea>
        <button type="button" class="add-btn remove-exp" style="margin-top:0.5rem;background:#fee2e2;color:#b91c1c;border-color:#b91c1c;"><i class="fas fa-trash"></i> Remove</button>
    `;
    div.querySelector('.remove-exp').onclick = () => {
        div.remove();
        updateResume();
    };
    ['input', 'textarea'].forEach(tag => {
        div.querySelectorAll(tag).forEach(el => el.addEventListener('input', updateResume));
    });
    return div;
}

function createEducationItem(data = {}) {
    const div = document.createElement('div');
    div.className = 'form-group education-item';
    div.innerHTML = `
        <input type="text" class="edu-title" placeholder="Degree" value="${data.title || ''}" maxlength="40" style="margin-bottom:0.5rem;">
        <input type="text" class="edu-school" placeholder="School/University" value="${data.school || ''}" maxlength="40" style="margin-bottom:0.5rem;">
        <input type="text" class="edu-dates" placeholder="Dates (e.g. 2018-2022)" value="${data.dates || ''}" maxlength="30" style="margin-bottom:0.5rem;">
        <textarea class="edu-desc" placeholder="Description" rows="2" maxlength="200">${data.desc || ''}</textarea>
        <button type="button" class="add-btn remove-edu" style="margin-top:0.5rem;background:#fee2e2;color:#b91c1c;border-color:#b91c1c;"><i class="fas fa-trash"></i> Remove</button>
    `;
    div.querySelector('.remove-edu').onclick = () => {
        div.remove();
        updateResume();
    };
    ['input', 'textarea'].forEach(tag => {
        div.querySelectorAll(tag).forEach(el => el.addEventListener('input', updateResume));
    });
    return div;
}

function getExperienceData() {
    return Array.from(document.querySelectorAll('.experience-item')).map(item => ({
        title: item.querySelector('.exp-title').value,
        company: item.querySelector('.exp-company').value,
        dates: item.querySelector('.exp-dates').value,
        desc: item.querySelector('.exp-desc').value
    }));
}

function getEducationData() {
    return Array.from(document.querySelectorAll('.education-item')).map(item => ({
        title: item.querySelector('.edu-title').value,
        school: item.querySelector('.edu-school').value,
        dates: item.querySelector('.edu-dates').value,
        desc: item.querySelector('.edu-desc').value
    }));
}

function updateResume() {
    const name = document.getElementById('name').value.trim();
    const role = document.getElementById('role').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const skills = document.getElementById('skills').value.trim().split(',').map(s => s.trim()).filter(Boolean);
    const experiences = getExperienceData();
    const educations = getEducationData();
    const profilePic = document.getElementById('profilePicPreview').src;
    let profilePicHTML = '';
    if (profilePic && profilePic !== '#' && profilePic !== window.location.href + '#') {
        profilePicHTML = `<img src="${profilePic}" alt="Profile Picture">`;
    }
    let expHTML = '';
    if (experiences.length) {
        expHTML = `<div class="resume-section"><h3><i class="fas fa-briefcase"></i> Experience</h3>` +
            experiences.map(exp => `
                <div class="experience-entry">
                    <div class="exp-title">${exp.title || ''}</div>
                    <div class="exp-company">${exp.company || ''}</div>
                    <div class="exp-dates">${exp.dates || ''}</div>
                    <div class="exp-desc">${exp.desc || ''}</div>
                </div>
            `).join('') + `</div>`;
    }
    let eduHTML = '';
    if (educations.length) {
        eduHTML = `<div class="resume-section"><h3><i class="fas fa-graduation-cap"></i> Education</h3>` +
            educations.map(edu => `
                <div class="education-entry">
                    <div class="edu-title">${edu.title || ''}</div>
                    <div class="edu-school">${edu.school || ''}</div>
                    <div class="edu-dates">${edu.dates || ''}</div>
                    <div class="edu-desc">${edu.desc || ''}</div>
                </div>
            `).join('') + `</div>`;
    }
    let skillsHTML = '';
    if (skills.length) {
        skillsHTML = `<div class="resume-section"><h3><i class="fas fa-tools"></i> Skills</h3>
            <ul class="skills-list">${skills.map(skill => `<li>${skill}</li>`).join('')}</ul></div>`;
    }
    document.getElementById('resumePreview').innerHTML = `
        <div class="resume-header">
            ${profilePicHTML}
            <div class="resume-header-info">
                <h1>${name || 'Your Name'}</h1>
                <h2>${role || 'Professional Title'}</h2>
                <div class="contact-row">
                    <span><i class="fas fa-envelope"></i> ${email || 'email@example.com'}</span>
                    <span><i class="fas fa-phone"></i> ${phone || '123-456-7890'}</span>
                </div>
            </div>
        </div>
        ${expHTML}
        ${eduHTML}
        ${skillsHTML}
    `;
}

function previewProfilePicture(event) {
    const file = event.target.files[0];
    const preview = document.getElementById('profilePicPreview');
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.src = e.target.result;
            preview.style.display = 'block';
            updateResume();
        };
        reader.readAsDataURL(file);
    } else {
        preview.src = '#';
        preview.style.display = 'none';
        updateResume();
    }
}

function downloadResumeAsPDF() {
    const element = document.getElementById('resumePreview');
    const opt = {
        margin: 0,
        filename: 'resume.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'pt', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().from(element).set(opt).save();
}

document.addEventListener('DOMContentLoaded', function() {
    // Experience
    const experienceList = document.getElementById('experience-list');
    document.getElementById('add-experience').onclick = function() {
        experienceList.appendChild(createExperienceItem());
        updateResume();
    };
    // Education
    const educationList = document.getElementById('education-list');
    document.getElementById('add-education').onclick = function() {
        educationList.appendChild(createEducationItem());
        updateResume();
    };
    // Profile Pic
    document.getElementById('profilePic').addEventListener('change', previewProfilePicture);
    // Form fields
    ['name','role','email','phone','skills'].forEach(id => {
        document.getElementById(id).addEventListener('input', updateResume);
    });
    // Generate Resume
    document.getElementById('generate-resume').onclick = updateResume;
    // Initial
    updateResume();

    // Dark mode toggle
    const darkToggle = document.getElementById('dark-mode-toggle');
    if (localStorage.getItem('darkMode') === 'enabled') {
        document.body.classList.add('dark-mode');
        darkToggle.checked = true;
    }
    darkToggle.addEventListener('change', function() {
        if (darkToggle.checked) {
            document.body.classList.add('dark-mode');
            localStorage.setItem('darkMode', 'enabled');
        } else {
            document.body.classList.remove('dark-mode');
            localStorage.setItem('darkMode', 'disabled');
        }
    });

    // Nav link active state (demo only)
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            e.preventDefault();
        });
    });
});
