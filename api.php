<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$action = isset($_GET['action']) ? $_GET['action'] : '';

// Função para ler arquivo JSON
function get_data($file) {
    if (!file_exists($file)) {
        file_put_contents($file, '[]'); // Cria vazio se não existir
    }
    return file_get_contents($file);
}

// Função para salvar no arquivo JSON
function save_data($file, $new_item) {
    $data = json_decode(get_data($file), true);
    if (!is_array($data)) $data = [];
    $data[] = $new_item;
    file_put_contents($file, json_encode($data, JSON_PRETTY_PRINT));
}

if ($action === 'get_recados') {
    echo get_data('recados.json');
} elseif ($action === 'add_recado') {
    $data = json_decode(file_get_contents('php://input'), true);
    if ($data && isset($data['texto'])) {
        save_data('recados.json', $data);
        echo json_encode(["status" => "sucesso"]);
    } else {
        echo json_encode(["status" => "erro"]);
    }
} elseif ($action === 'get_fotos') {
    echo get_data('fotos.json');
} elseif ($action === 'upload_foto') {
    // Nova lógica que faz o Upload direto do celular/PC
    if (isset($_FILES['foto']) && $_FILES['foto']['error'] === UPLOAD_ERR_OK) {
        $uploadDir = 'uploads/';
        
        // Cria a pasta uploads se ela não existir no servidor
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }
        
        $fileInfo = pathinfo($_FILES['foto']['name']);
        $ext = strtolower(isset($fileInfo['extension']) ? $fileInfo['extension'] : '');
        $allowed = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
        
        if (!in_array($ext, $allowed)) {
             echo json_encode(["status" => "erro", "message" => "Apenas imagens (jpg, png, gif) são permitidas."]);
             exit;
        }

        // Dá um nome único para a foto não substituir outra sem querer
        $fileName = uniqid('foto_') . '.' . $ext;
        $targetPath = $uploadDir . $fileName;

        if (move_uploaded_file($_FILES['foto']['tmp_name'], $targetPath)) {
            $desc = isset($_POST['desc']) ? $_POST['desc'] : '';
            $email = isset($_POST['email']) ? $_POST['email'] : '';
            
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
        echo json_encode(["status" => "erro", "message" => "Nenhuma foto foi enviada ou ocorreu um erro no upload."]);
    }
} else {
    echo json_encode(["error" => "Ação inválida"]);
}
?>