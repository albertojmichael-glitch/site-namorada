<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');

$action = isset($_GET['action']) ? $_GET['action'] : '';

// 1. CONEXÃO COM O BANCO DE DADOS POSTGRESQL DO RAILWAY
// O Railway injeta essa URL automaticamente nas variáveis de ambiente
$db_url = getenv("DATABASE_URL");

if (!$db_url) {
    echo json_encode(["status" => "erro", "message" => "Banco de dados não conectado. Verifique a DATABASE_URL no Railway."]);
    exit;
}

try {
    $dbopts = parse_url($db_url);
    $dsn = "pgsql:host=" . $dbopts["host"] . ";port=" . $dbopts["port"] . ";dbname=" . ltrim($dbopts["path"],'/');
    $pdo = new PDO($dsn, $dbopts["user"], $dbopts["pass"], [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
    
    // Cria as tabelas automaticamente se elas não existirem!
    $pdo->exec("CREATE TABLE IF NOT EXISTS recados (id SERIAL PRIMARY KEY, nome TEXT, texto TEXT, email TEXT, data TEXT)");
    $pdo->exec("CREATE TABLE IF NOT EXISTS fotos (id SERIAL PRIMARY KEY, url TEXT, descricao TEXT, email TEXT)");
    $pdo->exec("CREATE TABLE IF NOT EXISTS memorias (id SERIAL PRIMARY KEY, url TEXT, dataText TEXT, descricao TEXT, cor TEXT, email TEXT)");
} catch (PDOException $e) {
    echo json_encode(["status" => "erro", "message" => "Erro de conexão com o Banco: " . $e->getMessage()]);
    exit;
}

function sanitize($input) {
    return htmlspecialchars(strip_tags(trim($input)), ENT_QUOTES, 'UTF-8');
}

// 2. LÓGICA DA API COM SQL
if ($action === 'get_recados') {
    $stmt = $pdo->query("SELECT nome, texto, email, data FROM recados ORDER BY id ASC");
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));

} elseif ($action === 'add_recado') {
    $raw = file_get_contents('php://input');
    $data = json_decode($raw, true);
    if ($data && isset($data['texto'])) {
        $nome = sanitize($data['nome'] ?? 'Anônimo');
        $texto = sanitize($data['texto']);
        $email = sanitize($data['email'] ?? '');
        $data_str = sanitize($data['data'] ?? date('d/m/Y'));
        
        $stmt = $pdo->prepare("INSERT INTO recados (nome, texto, email, data) VALUES (?, ?, ?, ?)");
        $stmt->execute([$nome, $texto, $email, $data_str]);
        echo json_encode(["status" => "sucesso"]);
    } else {
        echo json_encode(["status" => "erro", "message" => "Dados inválidos."]);
    }

} elseif ($action === 'get_fotos') {
    // Usamos "descricao as desc" para o JS continuar lendo como f.desc
    $stmt = $pdo->query("SELECT url, descricao as desc, email FROM fotos ORDER BY id ASC");
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));

} elseif ($action === 'upload_foto') {
    if (isset($_FILES['foto']) && $_FILES['foto']['error'] === UPLOAD_ERR_OK) {
        $ext = strtolower(pathinfo($_FILES['foto']['name'], PATHINFO_EXTENSION));
        if (!in_array($ext, ['jpg', 'jpeg', 'png', 'gif', 'webp'])) {
             echo json_encode(["status" => "erro", "message" => "Formato de imagem não permitido."]); exit;
        }
        
        // TRUQUE MÁGICO: Transforma a imagem em código de texto (Base64) para salvar no banco!
        $imgData = file_get_contents($_FILES['foto']['tmp_name']);
        $base64 = 'data:' . mime_content_type($_FILES['foto']['tmp_name']) . ';base64,' . base64_encode($imgData);
        
        $desc = sanitize($_POST['desc'] ?? '');
        $email = sanitize($_POST['email'] ?? '');
        
        $stmt = $pdo->prepare("INSERT INTO fotos (url, descricao, email) VALUES (?, ?, ?)");
        $stmt->execute([$base64, $desc, $email]);
        echo json_encode(["status" => "sucesso"]);
    } else {
        echo json_encode(["status" => "erro", "message" => "Erro ao receber a foto."]);
    }

} elseif ($action === 'get_memorias') {
    $stmt = $pdo->query("SELECT url, dataText, descricao as desc, cor, email FROM memorias ORDER BY id ASC");
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));

} elseif ($action === 'upload_memoria') {
    if (isset($_FILES['foto']) && $_FILES['foto']['error'] === UPLOAD_ERR_OK) {
        $ext = strtolower(pathinfo($_FILES['foto']['name'], PATHINFO_EXTENSION));
        if (!in_array($ext, ['jpg', 'jpeg', 'png', 'gif', 'webp'])) {
             echo json_encode(["status" => "erro", "message" => "Formato de imagem não permitido."]); exit;
        }
        
        // Transforma a imagem da memória em código de texto (Base64)
        $imgData = file_get_contents($_FILES['foto']['tmp_name']);
        $base64 = 'data:' . mime_content_type($_FILES['foto']['tmp_name']) . ';base64,' . base64_encode($imgData);
        
        $dataText = sanitize($_POST['dataText'] ?? '');
        $desc = sanitize($_POST['desc'] ?? '');
        $cor = sanitize($_POST['cor'] ?? '#ff6a00');
        $email = sanitize($_POST['email'] ?? '');
        
        $stmt = $pdo->prepare("INSERT INTO memorias (url, dataText, descricao, cor, email) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([$base64, $dataText, $desc, $cor, $email]);
        echo json_encode(["status" => "sucesso"]);
    } else {
        echo json_encode(["status" => "erro", "message" => "Erro ao receber a foto da memória."]);
    }
} else {
    echo json_encode(["error" => "Ação inválida"]);
}
?>
