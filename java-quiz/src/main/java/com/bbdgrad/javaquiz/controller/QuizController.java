  
package com.bbdgrad.javaquiz.controller;
import com.bbdgrad.javaquiz.model.Session;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

@CrossOrigin(origins = "*", maxAge = 3600)
@Controller
public class QuizController {
	private Session session;

	@GetMapping("/home")
	public String home(@RequestParam(name="name", required=false, defaultValue="World") String name, Model model) {
		model.addAttribute("name", name);
		return "home";
	}
	
	@GetMapping("/login")
	public String login() {
		return "login";
	}

	@GetMapping("/signup")
	public String signup() {
		return "signup";
	}

	@GetMapping("/singleplayer")
	public String singleplayer() {
		return "singleplayer";
	}

	@GetMapping("/multiplayer")
	public String multiplayer() {
		return "multiplayer";
	}

	@GetMapping("/multiplayer/quizSetup")
	public String multiplayerQuizSetup() {
		return "multiplayerQuizSetup";
	}

	@GetMapping("/multiplayer/join")
	public String join() {
		return "join";
	}

	@GetMapping("/singleplayer/quizSetup")
	public String singleplayerSetup() {
		return "sinlgeplayerQuizSetup";
	}

	@GetMapping("/singleplayer/quiz")
	public String singleplayerQuiz() {
		return "singleplayerQuiz";
	}

	@GetMapping("/multiplayer/quiz")
	public String multiplayerQuiz() {
		return "quiz";
	}

	@PostMapping("/multiplayer/createsession") 
	public String host(@RequestBody Session session) {
		return "host";
	}

	@PostMapping("/multiplayer/joinsession") 
	public String join(@RequestBody Session session) {
		return "host";
	}

	@PostMapping("/singleplayer/createsession") 
	public String hostSingleplayer(@RequestBody Session session) {
		this.session = session;
		return "host";
	}

	@GetMapping("/multiplayer/host") 
	public String playerJoin() {
		return "host";
	}
}