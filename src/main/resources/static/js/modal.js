class Modal {
        const modal = document.getElementById('paramsModal');
    const cancelBtn = document.getElementById('cancelBtn');
    const submitBtn = document.getElementById('submitBtn');
    const param1Input = document.getElementById('param1');
    const param2Input = document.getElementById('param2');

        openBtn.addEventListener('click', () => {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        setTimeout(() => param1Input.focus(), 100);
    });
        function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
    cancelBtn.addEventListener('click', closeModal);
    submitBtn.addEventListener('click', (e) => {
        e.preventDefault();

        closeModal();
        document.getElementById('paramsForm').reset();
    });

        modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

         document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
        }