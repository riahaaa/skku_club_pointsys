document.addEventListener('DOMContentLoaded', function() {
    const registrationForm = document.getElementById('registrationForm');

    registrationForm.addEventListener('submit', function(event) {
        event.preventDefault(); // 기본 폼 제출 동작 방지

        const studentId = document.getElementById('studentId').value.trim();
        const name = document.getElementById('name').value.trim();
        const adminCode = document.getElementById('adminCode').value.trim();

        // 입력 필드 유효성 검사 (간단한 예시)
        if (!studentId || !name || !adminCode) {
            alert('모든 필드를 정확하게 입력해주세요.');
            return;
        }

        // 서버로 데이터 전송 (포인트 추가 요청)
        fetch('/api/register-activity', { // 실제 서버 API 엔드포인트로 변경
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ studentId: studentId, name: name, adminCode: adminCode })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // 서버에서 포인트 추가 성공 응답을 받음
                const addedPoints = data.addedPoints || 0; // 추가된 포인트 (서버에서 전달)
                const currentPoints = data.currentPoints || 0; // 현재 총 포인트 (서버에서 전달)

                // 알림 메시지 출력
                alert(`${name}님의 포인트가 ${addedPoints}점 추가되었습니다. 현재 보유한 포인트는 총 ${currentPoints}점입니다.`);

                registrationForm.reset(); // 폼 초기화 (선택 사항)
            } else {
                alert(data.message || '포인트 추가에 실패했습니다. 관리자 코드를 확인해주세요.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('서버와 통신 중 오류가 발생했습니다.');
        });
    });
});