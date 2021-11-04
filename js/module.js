
import * as THREE from '../three/three.module.js';

import { OrbitControls } from '../three/OrbitControls.js';

let group, camera, scene, renderer;

let sourceGroup;

let modelGeometry, sourceGeometry, coneGeometry, coneLinesGeometry, detectorGeometry;

let model, source, cone, coneLines, detector;

var vertexShader = `
    varying vec2 vUv;
    void main()	{
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
    }
  `;
var fragmentShader = `
		//#extension GL_OES_standard_derivatives : enable
    
    varying vec2 vUv;
    uniform float thickness;
    uniform float color;
   	
    float edgeFactor(vec2 p){
    	vec2 grid = abs(fract(p - 0.5) - 0.5) / fwidth(p) / thickness;
  		return min(grid.x, grid.y);
    }
    
    void main() {
			
      float a = edgeFactor(vUv);
      
      vec3 c = mix(vec3(1), vec3(0), a);
      //vec4(c, 1.0);
      float z = gl_FragCoord.z / gl_FragCoord.w;
      gl_FragColor = max(vec4(0.15, 0.62, 0.9, 1.0),vec4(c, 1.0));
    }
  `;

const material = new THREE.ShaderMaterial({
    side: THREE.DoubleSide,
    uniforms: {
        thickness: {
            value: 1.5
        },
        color: {
            value: [0.15, 0.62, 0.9]
        }
    },
    vertexShader: vertexShader,
    fragmentShader: fragmentShader
});
const material2 = new THREE.MeshLambertMaterial({ color: 0xFF0000, emissive: 0x072534, side: THREE.DoubleSide });
const materialCone = new THREE.MeshBasicMaterial({ color: 0xAA00AA, emissive: 0x072534, side: THREE.FrontSide, transparent: true, opacity: 0.5, depthWrite: false });

const materialDetector = new THREE.MeshLambertMaterial({ color: 0xAAAAAA, emissive: 0xFF1111 });

const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 });

const verticesBeam = new Float32Array([
    0, 0, 0,
    .5, 0, .5,
    0, 0, 1,

    .5, 0, .5,
    1, 0, 1,
    0, 0, 1,

    .5, 0, .5,
    1, 0, 0,
    1, 0, 1,

    .5, 0, .5,
    0, 0, 0,
    1, 0, 0,

    1, 0, 0,
    0, 0, 0,
    0, 1, .5,

    0, 0, 1,
    1, 0, 1,
    0, 1, .5,

    // 0, 0, 1,
    // 1, 0, 1,
    // 0, 0, 0,

    1, 0, 1,
    1, 0, 0,
    0, 1, 0.5,

    0, 0, 1,
    0, 1, 0.5,
    0, 0, 0,
]);


var mammoBeam = new THREE.BufferGeometry();
mammoBeam.setAttribute('position', new THREE.BufferAttribute(verticesBeam, 3));


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
    "source-x": 0.0,
    "source-y": 4.825,
    "source-z": 63.0,
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
    "model-size-x": 810,
    "model-size-y": 1920,
    "model-size-z": 745,
    "voxel_size": [0.005, 0.005, 0.005],
    "low_resolution_voxel_size": [0, 0, 0]
};

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
    camera.position.set(15, 15, 15);
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

    scene.add(new THREE.AxesHelper(10));

    // textures

    const loader = new THREE.TextureLoader();
    // const texture = loader.load('textures/sprites/disc.png');

    sourceGeometry = new THREE.SphereGeometry(1);
    modelGeometry = new THREE.BoxGeometry(1, 1, 1);

    model = new THREE.Mesh(modelGeometry, material);
    scene.add(model);

    sourceGroup = new THREE.Group();

    coneGeometry = new THREE.ConeGeometry(100, 4, 100);

    source = new THREE.Mesh(sourceGeometry, material2);
    cone = new THREE.Mesh(coneGeometry, materialCone);
    coneLines = new THREE.LineSegments(mammoBeam, lineMaterial)


    sourceGroup.add(source);
    // sourceGroup.add(cone);
    sourceGroup.add(coneLines);
    cone = new THREE.Mesh(mammoBeam, material);
    sourceGroup.add(cone);
    scene.add(sourceGroup);

    detectorGeometry = new THREE.BoxGeometry(1, 1, 1);

    detector = new THREE.Mesh(detectorGeometry, materialDetector);
    scene.add(detector);



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
    let x, y, z, aperture;
    x = parseInt(mcgpu_dict["model-size-x"]) * mcgpu_dict["voxel_size"][0];
    y = parseInt(mcgpu_dict["model-size-y"]) * mcgpu_dict["voxel_size"][1];
    z = parseInt(mcgpu_dict["model-size-z"]) * mcgpu_dict["voxel_size"][2];

    // console.log(x, y, z);
    model.scale.set(x, z, y);
    model.position.x = x / 2;
    model.position.z = y / 2;
    model.position.y = z / 2;

    detector.scale.set(x, 0.1, y);
    detector.position.x = x / 2;
    detector.position.z = y / 2;
    detector.position.y = -0.1;

    x = parseFloat(mcgpu_dict["source-x"]);
    y = parseFloat(mcgpu_dict["source-y"]);
    z = parseFloat(mcgpu_dict["source-z"]);
    aperture = parseFloat(mcgpu_dict["fam_beam_aperture"][0]);

    source.position.set(x, z, y);

    cone.removeFromParent();
    // coneGeometry = new THREE.ConeGeometry(15 * z / (101 - aperture), z, 4);
    // coneGeometry.rotateY(45 * Math.PI / 180)
    // coneGeometry.scale(0.5, 1, 1);
    cone = new THREE.Mesh(mammoBeam, materialCone);
    cone.scale.set(aperture / 2, z, aperture);
    // cone.position.x = x;
    // cone.position.y = z / 2;
    // cone.position.z = y;

    coneLines.removeFromParent();
    coneLines = new THREE.LineSegments(new THREE.WireframeGeometry(mammoBeam), lineMaterial);
    coneLines.scale.set(aperture / 2, z, aperture);
    sourceGroup.add(cone);
    sourceGroup.add(coneLines);



    // x = parseFloat(document.getElementById("source-x-val").value);
    // y = parseFloat(document.getElementById("source-y-val").value);
    // z = parseFloat(document.getElementById("source-z-val").value);
    // aperture = parseFloat(document.getElementById("source-aperture").value);


    // sourceGroup.add(cone);

    // console.log(modelGeometry);

    requestAnimationFrame(animate);

    render();

}

function render() {

    renderer.render(scene, camera);

}


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
                var mult = div.attr("mult");
                if (mult === undefined)
                    mult = 1;
                $("#" + div.attr("id") + "-val").val(parseFloat(ui.value) * parseFloat(mult));
                mcgpu_dict[div.attr("id")] = parseFloat(ui.value) * parseFloat(mult);
                mcgpu_dict["fam_beam_aperture"][0] = $("#source-aperture-val").val();
                mcgpu_dict["fam_beam_aperture"][1] = mcgpu_dict["fam_beam_aperture"][0] / 2;
                generateMCGPU();
            },
            min: parseInt(div.attr("slider-min")),
            max: parseInt(div.attr("slider-max")),
            value: parseInt(div.attr("svalue")),
        });
        var mult = div.attr("mult");
        if (mult === undefined)
            mult = 1;
        $("#" + div.attr("id") + "-val").val(parseFloat(div.attr("svalue")) * parseFloat(mult));
        mcgpu_dict[div.attr("id")] = parseFloat(div.attr("svalue")) * parseFloat(mult);
    };
    createSlider($("#model-size-x"));
    createSlider($("#model-size-y"));
    createSlider($("#model-size-z"));

    createSlider($("#source-x"));
    createSlider($("#source-y"));
    createSlider($("#source-z"));
    createSlider($("#source-aperture"));

    $(document).on("change", 'input.slider-value', function () {
        var id = $(this).attr("id");
        var id2 = id.substring(0, id.length - 4);
        $("#" + id2).slider("value", $(this).val());
        mcgpu_dict[id2] = $(this).val();
        console.log(mcgpu_dict);
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

