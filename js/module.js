
import * as THREE from '../three/three.module.js';

import { OrbitControls } from '../three/OrbitControls.js';

let group, camera, scene, renderer;

let sourceGroup;

let modelGeometry, sourceGeometry, coneGeometry;

let model, source, cone;

const material = new THREE.MeshLambertMaterial({ color: 0x156289, emissive: 0x072534, side: THREE.DoubleSide, transparent: true, opacity: 0.5 });
const material2 = new THREE.MeshLambertMaterial({ color: 0xFF0000, emissive: 0x072534, side: THREE.DoubleSide });
const materialCone = new THREE.MeshLambertMaterial({ color: 0xAA00AA, emissive: 0x072534, side: THREE.DoubleSide, transparent: true, opacity: 0.2 });


init();
animate();

function init() {

    scene = new THREE.Scene();

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth - 300, 400);
    document.getElementById("canvas").appendChild(renderer.domElement);

    // camera

    camera = new THREE.PerspectiveCamera(40, (window.innerWidth - 300) / 400, 1, 10000);
    camera.position.set(300, 300, 300);
    scene.add(camera);

    // controls

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.minDistance = 20;
    controls.maxDistance = 10000;
    controls.maxPolarAngle = Math.PI / 2;

    // ambient light

    scene.add(new THREE.AmbientLight(0xaaaaaa));

    // point light

    // const light = new THREE.PointLight(0xffffff, 1, 0);
    // light.position.set(0, 100, 0);
    // scene.add(light);

    // const pointLightHelper = new THREE.PointLightHelper(light, 10);
    // scene.add(pointLightHelper);

    // helper

    scene.add(new THREE.AxesHelper(200));

    // textures

    const loader = new THREE.TextureLoader();
    // const texture = loader.load('textures/sprites/disc.png');

    group = new THREE.Group();
    scene.add(group);

    sourceGeometry = new THREE.SphereGeometry(10);
    modelGeometry = new THREE.BoxGeometry(1, 1, 1);

    model = new THREE.Mesh(modelGeometry, material);
    group.add(model);

    sourceGroup = new THREE.Group();

    coneGeometry = new THREE.ConeGeometry(100, 200, 100);
    source = new THREE.Mesh(sourceGeometry, material2);
    cone = new THREE.Mesh(coneGeometry, materialCone);

    sourceGroup.add(source);
    // sourceGroup.add(cone);

    group.add(sourceGroup);

    const lights = [];
    lights[0] = new THREE.PointLight(0xaaaaaa, 1, 0);
    lights[1] = new THREE.PointLight(0xaaaaaa, 1, 0);
    lights[2] = new THREE.PointLight(0xaaaaaa, 1, 0);

    lights[0].position.set(0, 200, 0);
    lights[1].position.set(100, 200, 100);
    lights[2].position.set(- 100, - 200, - 100);

    scene.add(lights[0]);
    scene.add(lights[1]);
    scene.add(lights[2]);


    window.addEventListener('resize', onWindowResize);

}

function onWindowResize() {

    camera.aspect = (window.innerWidth - 300) / 400;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth - 300, 400);

}

function animate() {



    // group.rotation.y += 0.005;

    let x, y, z, aperture;
    x = parseInt(document.getElementById("model-size-x-val").value);
    y = parseInt(document.getElementById("model-size-y-val").value);
    z = parseInt(document.getElementById("model-size-z").value);

    // console.log(x, y, z);
    model.scale.set(x, y, z);
    model.position.y = y / 2;

    x = parseInt(document.getElementById("source-x").value);
    y = parseInt(document.getElementById("source-y").value);
    z = parseInt(document.getElementById("source-z").value);
    aperture = parseInt(document.getElementById("source-aperture").value);

    source.position.set(x, y, z);

    cone.removeFromParent();
    cone = new THREE.Mesh(new THREE.ConeGeometry(50 * y / aperture, y, 100), materialCone);
    cone.position.x = x;
    cone.position.y = y / 2;
    cone.position.z = z;
    scene.add(cone);
    // sourceGroup.add(cone);

    // console.log(modelGeometry);

    requestAnimationFrame(animate);

    render();

}

function render() {

    renderer.render(scene, camera);

}

var mcgpu_template = "";
var mcgpu_dict = {
    "number_histories": 7.8e9,
    "random_seed": 31415990,
    "selected_gpu": 0,
    "number_gpus": 1,
    "gpu_threads": 128,
    "histories_per_thread": 5000,
    "spectrum_file": "./Victre/projection/spectrum/W28kVp_Rh50um_Be1mm.spc",
    "source_position": [0.00001, 4.825, 63.0],
    "source_direction": [0.0, 0.0, -1.0],
    "fam_beam_aperture": [15.0, 7.4686667],
    "euler_angles": [90.0, -90.0, 180.0],
    "focal_spot": 0.0300,
    "angular_blur": 0.18,
    "collimate_beam": "YES",
    "output_file": undefined,
    "image_pixels": [3000, 1500],
    "image_size": [25.50, 12.75],
    "distance_source": 65.00,
    "image_offset": [0, 0],
    "detector_thickness": 0.02,
    "mean_free_path": 0.004027,
    "k_edge_energy": [12658.0, 11223.0, 0.596, 0.00593],
    "detector_gain": [50.0, 0.99],
    "additive_noise": 5200.0,
    "cover_thickness": [0.10, 1.9616],
    "antiscatter_grid_ratio": [5.0, 31.0, 0.0065],
    "antiscatter_strips": [0.00089945, 1.9616],
    "antiscatter_grid_lines": 0,
    "number_projections": 25,
    "rotation_axis_distance": 60.0,
    "projections_angle": 2.083333333333,
    "angular_rotation_first": -25.0,
    "rotation_axis": [1.0, 0.0, 0.0],
    "axis_translation": 0,
    "detector_fixed": "YES",
    "simulate_both": "YES",
    "tally_material_dose": "YES",
    "tally_voxel_dose": "NO",
    "output_dose_filename": "mc-gpu_dose.dat",
    "roi_voxel_dose_x": [1, 751],
    "roi_voxel_dose_y": [1, 1301],
    "roi_voxel_dose_z": [250, 250],
    "phantom_file": undefined,
    "voxel_geometry_offset": [0, 0, 0],
    "number_voxels": [810, 1920, 745],
    "model-size-x": 810,
    "model-size-y": 1920,
    "model-size-z": 745,
    "voxel_size": [0.005, 0.005, 0.005],
    "low_resolution_voxel_size": [0, 0, 0]
};

$(document).ready(function () {
    $(document).on("change", 'input.other', function () {
        mcgpu_dict[$(this).attr("id")] = $(this).val();
        generateMCGPU();
    });
    $('input.slider-value').change(function () {
        $("#" + $(this).attr("id") + "-val").val($(this).val());

        mcgpu_dict["source_position"] = [$("#source-x").val(), $("#source-z").val(), $("#source-y").val()];

        generateMCGPU();
    });
    $.get('templates/mcgpu-v1.5b.tpl', function (data) {
        mcgpu_template = data;
        generateMCGPU();
    }, 'text');

    $("#download").click(function () {
        download("input-mcgpu.txt", $("#mcgpu").text());
    })

    for (var key in mcgpu_dict) {
        $("#mcgpu-other").append("<div>" + key + ': <input class="other" id="' + key + '" value="' + mcgpu_dict[key] + '"></div>')
    }

    var createSlider = function (div) {
        var slide = $(div).slider({
            range: "min",
            slide: function (event, ui) {
                $("#" + div.attr("id") + "-val").val(ui.value);
                mcgpu_dict[div.attr("id")] = ui.value;
                generateMCGPU();
            },
            min: parseInt(div.attr("slider-min")),
            max: parseInt(div.attr("slider-max")),
            value: parseInt(div.attr("svalue")),
        });
        $("#" + div.attr("id") + "-val").val(div.attr("svalue"));
    };
    createSlider($("#model-size-x"));
    createSlider($("#model-size-y"));

    $(document).on("change", 'input.slider-value', function () {
        var id = $(this).attr("id");
        var id2 = id.substring(0, id.length - 4);
        $("#" + id2).slider("value", $(this).val());
        mcgpu_dict[id2] = $(this).val();
        generateMCGPU();
    });
});



function generateMCGPU() {
    var template = Handlebars.compile(mcgpu_template);
    // console.log(mcgpu_dict);
    $("#mcgpu").html(template(mcgpu_dict)).wrap('<pre />');
}

function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

