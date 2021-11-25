import {PomoTaskItem} from "./pomo_task_item";
import PomoTimerPlugin from "./main";
import {WorkItem} from "./workitem";
import {TFile} from "obsidian";

export class ParseUtility {

    plugin: PomoTimerPlugin;

    constructor(plugin: PomoTimerPlugin) {
        this.plugin = plugin;
    }

    async gatherPostPomoTaskItems(workItem: WorkItem) {
        let activeFileContent: string;
        await this.plugin.app.vault.read(workItem.activeNote).then(value => {
            activeFileContent = value;
        });
        activeFileContent.split("\n").forEach((value, index) => {
            if (value.trim().startsWith('- [ ]')) {
                workItem.postPomoTaskItems.push( new PomoTaskItem(value.replace('- [ ]', ""), false));
            } else if (value.trim().startsWith('- [x]') || value.trim().startsWith('- [X]')) {
                workItem.postPomoTaskItems.push(new PomoTaskItem(value.replace('- [x]', '').replace('- [X]', ''), true));
            }
        })
        workItem.postPomoTaskItems.forEach((value, index, array) => {
            if (!workItem.initialPomoTaskItems.some(initialvalue => {
                return (value.lineContent === initialvalue.lineContent && value.isCompleted === initialvalue.isCompleted);
            })) {
                workItem.modifiedPomoTaskItems.push(value);
            }
        });
    }

    async gatherLineItems(newWorkItem: WorkItem, pomoTaskItems: Array<PomoTaskItem>, isStore: boolean, activeFile:TFile) {
        let activeFileContent: string;
        await this.plugin.app.vault.read(activeFile).then(value => {
                activeFileContent = value;
        });

        this.processActiveFileContents(activeFileContent, pomoTaskItems, isStore, newWorkItem);
    }

    private processActiveFileContents(activeFileContent: string, pomoTaskItems: Array<PomoTaskItem>, isStore: boolean, newWorkItem: WorkItem) {
        activeFileContent.split("\n").forEach((value, index) => {
            if (value.trim().startsWith('- [ ]')) {
                pomoTaskItems.push(new PomoTaskItem(value.replace('- [ ]', ""), false));
            } else if (value.trim().startsWith('- [x]') || value.trim().startsWith('- [X]')) {
                pomoTaskItems.push(new PomoTaskItem(value.replace('- [x]', '').replace('- [X]', ''), true));
            }
        })
        if (isStore) {
            this.plugin.pomoWorkBench.addWorkbenchItem(newWorkItem);
        }
    }



}
