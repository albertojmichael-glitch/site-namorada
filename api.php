<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$action = isset($_GET['action']) ? $_GET['action'] : '';

function get_data($file) {
    if (!file_exists($file)) {
        file_put_contents($file, '[]');
    }
    return file_get_contents($file);
}

function save_data($file, $new_item) {
    $data = json_decode(get_data($file), true);
    if (json_last_error() !== JSON_ERROR_NONE || !is_array($data)) {
        $data = [];
    }
    $data[] = $new_item;
    file_put_contents($file, json_encode($data, JSON_PRETTY_PRINT));
}

// Sanitização robusta contra injeções
function sanitize($input) {
    return htmlspecialchars(strip_tags(trim($input)), ENT_QUOTES, 'UTF-8');
}

if ($action === 'get_recados') {
    echo get_data('recados.json');
} elseif ($action === 'add_recado') {
    $raw = file_get_contents('php://input');
    $data = json_decode($raw, true);
    if (json_last_error() === JSON_ERROR_NONE && $data && isset($data['texto'])) {
        // Sanitiza os campos antes de salvar
        $data['nome'] = sanitize($data['nome'] ?? 'Anônimo');
        $data['texto'] = sanitize($data['texto']);
        $data['email'] = sanitize($data['email'] ?? '');
        $data['data'] = sanitize($data['data'] ?? date('d/m/Y'));
        
        save_data('recados.json', $data);
        echo json_encode(["status" => "sucesso"]);
    } else {
        echo json_encode(["status" => "erro", "message" => "JSON inválido ou dados faltando."]);
    }
} elseif ($action === 'get_fotos') {
    echo get_data('fotos.json');
} elseif ($action === 'upload_foto') {
    if (isset($_FILES['foto']) && $_FILES['foto']['error'] === UPLOAD_ERR_OK) {
        $uploadDir = 'uploads/';
        if (!is_dir($uploadDir)) mkdir($uploadDir, 0777, true);
        
        $fileInfo = pathinfo($_FILES['foto']['name']);
        $ext = strtolower(isset($fileInfo['extension']) ? $fileInfo['extension'] : '');
        $allowed = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
        
        if (!in_array($ext, $allowed)) {
             echo json_encode(["status" => "erro", "message" => "Apenas imagens (jpg, png, gif) são permitidas."]);
             exit;
        }

        $fileName = uniqid('foto_') . '.' . $ext;
        $targetPath = $uploadDir . $fileName;

        if (move_uploaded_file($_FILES['foto']['tmp_name'], $targetPath)) {
            // Sanitiza os campos antes de salvar
            $desc = isset($_POST['desc']) ? sanitize($_POST['desc']) : '';
            $email = isset($_POST['email']) ? sanitize($_POST['email']) : '';
            
            $novaFoto = [
                "url" => $targetPath,
                "desc" => $desc,
                "email" => $email
            ];
            save_data('fotos.json', $novaFoto);
            echo json_encode(["status" => "sucesso"]);
        } else {
            echo json_encode(["status" => "erro", "message" => "Erro ao salvar a foto no servidor."]);
        }
    } else {
        echo json_encode(["status" => "erro", "message" => "Nenhuma foto enviada ou formato corrompido."]);
    }
} else {
    echo json_encode(["error" => "Ação inválida"]);
}
?>