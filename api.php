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
} elseif ($action === 'add_foto') {
    $data = json_decode(file_get_contents('php://input'), true);
    if ($data && isset($data['url'])) {
        save_data('fotos.json', $data);
        echo json_encode(["status" => "sucesso"]);
    } else {
        echo json_encode(["status" => "erro"]);
    }
} else {
    echo json_encode(["error" => "Ação inválida"]);
}
?>