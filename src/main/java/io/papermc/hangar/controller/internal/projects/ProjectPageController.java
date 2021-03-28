package io.papermc.hangar.controller.internal.projects;

import io.papermc.hangar.controller.HangarController;
import io.papermc.hangar.model.common.NamedPermission;
import io.papermc.hangar.model.common.PermissionType;
import io.papermc.hangar.model.internal.api.requests.StringContent;
import io.papermc.hangar.model.internal.api.requests.projects.NewProjectPage;
import io.papermc.hangar.model.internal.projects.HangarViewProjectPage;
import io.papermc.hangar.security.annotations.Anyone;
import io.papermc.hangar.security.annotations.permission.PermissionRequired;
import io.papermc.hangar.security.annotations.unlocked.Unlocked;
import io.papermc.hangar.security.annotations.visibility.VisibilityRequired;
import io.papermc.hangar.security.annotations.visibility.VisibilityRequired.Type;
import io.papermc.hangar.service.internal.MarkdownService;
import io.papermc.hangar.service.internal.projects.ProjectPageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;

import javax.validation.Valid;

@Anyone
@Controller
@RequestMapping("/api/internal/pages")
public class ProjectPageController extends HangarController {

    private final ProjectPageService projectPageService;
    private final MarkdownService markdownService;

    @Autowired
    public ProjectPageController(ProjectPageService projectPageService, MarkdownService markdownService) {
        this.projectPageService = projectPageService;
        this.markdownService = markdownService;
    }

    @PostMapping(path = "/render", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> renderMarkdown(@RequestBody @Valid StringContent content) {
        return ResponseEntity.ok(markdownService.render(content.getContent()));
    }

    @VisibilityRequired(type = Type.PROJECT, args = "{#author, #slug}")
    @GetMapping(path = "/page/{author}/{slug}/**", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<HangarViewProjectPage> getProjectPage(@PathVariable String author, @PathVariable String slug) {
        return ResponseEntity.ok(projectPageService.getProjectPage(author, slug, request.getRequestURI()));
    }

    @Unlocked
    @PermissionRequired(perms = NamedPermission.EDIT_PAGE, type = PermissionType.PROJECT, args = "{#projectId}")
    @PostMapping(value = "/create/{projectId}", consumes = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity<String> createProjectPage(@PathVariable long projectId, @RequestBody @Valid NewProjectPage newProjectPage) {
        return ResponseEntity.ok(projectPageService.createProjectPage(projectId, newProjectPage));
    }

    @Unlocked
    @PermissionRequired(perms = NamedPermission.EDIT_PAGE, type = PermissionType.PROJECT, args = "{#projectId}")
    @PostMapping(value = "/save/{projectId}/{pageId}", consumes = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(HttpStatus.OK)
    public void saveProjectPage(@PathVariable long projectId, @PathVariable long pageId, @RequestBody @Valid StringContent content) {
        projectPageService.saveProjectPage(projectId, pageId, content.getContent());
    }

    @Unlocked
    @PermissionRequired(perms = NamedPermission.EDIT_PAGE, type = PermissionType.PROJECT, args = "{#projectId}")
    @PostMapping("/delete/{projectId}/{pageId}")
    @ResponseStatus(HttpStatus.OK)
    public void deleteProjectPage(@PathVariable long projectId, @PathVariable long pageId) {
        projectPageService.deleteProjectPage(projectId, pageId);
    }
}